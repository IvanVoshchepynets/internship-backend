import type { FastifyPluginAsync } from "fastify";
import adServerController from "./controller";

const routes: FastifyPluginAsync = async (fastify) => {
	fastify.register(adServerController, { prefix: "/adServer" });
};

export default routes;
