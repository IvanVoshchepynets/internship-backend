import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function authRoutes(fastify: FastifyInstance) {
  const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

  fastify.post(
    "/auth/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };

      const existing = await fastify.prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.badRequest("Користувач вже існує");
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await fastify.prisma.user.create({
        data: { email, password: hashed },
      });

      return { id: user.id, email: user.email };
    },
  );

  fastify.post(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as { email: string; password: string };

      const user = await fastify.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.unauthorized("Невірні дані");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return reply.unauthorized("Невірні дані");
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
      return { token };
    },
  );
}
