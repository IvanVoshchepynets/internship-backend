import type { FastifyPluginAsync } from "fastify";
import { queryStats, type StatEvent, saveEvent } from "./service";

const statsController: FastifyPluginAsync = async (fastify) => {
	// буде доступно як POST /stats/event
	fastify.post("/event", async (req, reply) => {
		const body = req.body as StatEvent | StatEvent[];
		if (!body) {
			return reply.badRequest("No event data");
		}

		await saveEvent(fastify, body);
		return { success: true };
	});

	// буде доступно як GET /stats/query
	fastify.get("/query", async (req, reply) => {
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
