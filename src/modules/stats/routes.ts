import type { FastifyPluginAsync } from "fastify";
import statsController from "./controller";

const routes: FastifyPluginAsync = async (fastify) => {
	fastify.register(statsController, { prefix: "/stats" });
};

export default routes;
