import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "./schemas";

export default async function authRoutes(fastify: FastifyInstance) {
	const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

	fastify.post(
		"/auth/register",
		{ schema: registerSchema },
		async (request, reply) => {
			try {
				const { name, email, password } = request.body as {
					name: string;
					email: string;
					password: string;
				};

				const existing = await fastify.prisma.user.findUnique({
					where: { email },
				});
				if (existing) {
					return reply.badRequest("Користувач вже існує");
				}

				const hashed = await bcrypt.hash(password, 10);
				const user = await fastify.prisma.user.create({
					data: { name, email, password: hashed },
				});

				fastify.log.info(`User registered: ${email}`);
				return { id: user.id, email: user.email, name: user.name };
			} catch (err) {
				fastify.log.error("Registration failed:", err);
				return reply.internalServerError("Помилка при реєстрації");
			}
		},
	);

	fastify.post(
		"/auth/login",
		{ schema: loginSchema },
		async (request, reply) => {
			try {
				const { email, password } = request.body as {
					email: string;
					password: string;
				};

				const user = await fastify.prisma.user.findUnique({ where: { email } });
				if (!user) return reply.unauthorized("Невірні дані");

				const valid = await bcrypt.compare(password, user.password);
				if (!valid) return reply.unauthorized("Невірні дані");

				const token = jwt.sign(
					{ id: user.id, email: user.email, name: user.name },
					JWT_SECRET,
					{ expiresIn: "1h" },
				);

				fastify.log.info(`User logged in: ${email}`);
				return { token };
			} catch (err) {
				fastify.log.error("Login failed:", err);
				return reply.internalServerError("Помилка при вході");
			}
		},
	);
}
