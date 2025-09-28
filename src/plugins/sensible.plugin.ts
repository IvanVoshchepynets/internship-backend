import sensible from "@fastify/sensible";
import fp from "fastify-plugin";

const pluginName = "sensible-plugin";

export default fp(
	async (fastify) => {
		await fastify.register(sensible);
		fastify.log.info(`${pluginName} loaded`);
	},
	{
		name: pluginName,
	},
);
