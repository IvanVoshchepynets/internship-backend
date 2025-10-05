import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import type { FastifyPluginAsync } from "fastify";
import { getQuerySchema, postEventSchema } from "./schemas";
import { queryStats, type StatEvent, saveEvent } from "./service";

const statsController: FastifyPluginAsync = async (fastify) => {
	const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

	route.post("/event", { schema: postEventSchema }, async (req, reply) => {
		const body = req.body as StatEvent | StatEvent[];
		await saveEvent(fastify, body);
		return { success: true };
	});

	route.get("/query", { schema: getQuerySchema }, async (req, reply) => {
		const params = req.query as any;
		const data = await queryStats(fastify, params);

		if (params.format === "csv") {
			reply.type("text/csv");
			return data;
		}

		if (params.format === "xlsx") {
			reply.type("application/json");
			return data;
		}

		return data;
	});
};

export default statsController;
