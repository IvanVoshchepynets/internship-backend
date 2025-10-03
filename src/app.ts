import AutoLoad from "@fastify/autoload";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import path from "path";

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.log.info("Starting application...");

	await fastify.register(cors, { origin: "*" });

	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

	void fastify.register(import("./plugins/cron"));

	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: opts,
		ignorePattern: /cron(\.ts|\.js)$/,
	});

	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "modules"),
		options: opts,
		dirNameRoutePrefix: false,
	});
};

export default app;
