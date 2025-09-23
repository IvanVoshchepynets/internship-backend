import AutoLoad from "@fastify/autoload";
import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import path from "path";

const app: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || "supersecret",
	});

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
