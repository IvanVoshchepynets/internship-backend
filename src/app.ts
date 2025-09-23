import AutoLoad from "@fastify/autoload";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import type { FastifyPluginAsync } from "fastify";
import path from "path";

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.log.info("Starting application...");

	await fastify.register(cors, {
		origin: "*",
	});

	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

	fastify.decorate("prisma", new PrismaClient());

	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: opts,
	});

	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "modules"),
		options: opts,
		dirNameRoutePrefix: false,
	});
};

export default app;
