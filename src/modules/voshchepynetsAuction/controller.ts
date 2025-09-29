import multipart from "@fastify/multipart";
import type { FastifyPluginAsync } from "fastify";
import { formHtml } from "./page";
import { getMatchingLineItem, saveCreative, saveLineItem } from "./service";

const adServerController: FastifyPluginAsync = async (fastify) => {
	await fastify.register(multipart);

	fastify.get("/adServer/form", async (_, reply) => {
		reply.type("text/html").send(formHtml);
	});

	fastify.post("/adServer/form", async (req, reply) => {
		const parts = req.parts();

		let size = "";
		let minCpm = 0;
		let maxCpm = 0;
		let geo = "";
		let adType = "";
		let frequency = 0;
		let creativeUrl = "";

		for await (const part of parts) {
			if (part.type === "file") {
				creativeUrl = saveCreative(part);
			} else if (part.type === "field") {
				if (part.fieldname === "size") size = part.value as string;
				if (part.fieldname === "minCpm") minCpm = Number(part.value);
				if (part.fieldname === "maxCpm") maxCpm = Number(part.value);
				if (part.fieldname === "geo") geo = part.value as string;
				if (part.fieldname === "adType") adType = part.value as string;
				if (part.fieldname === "frequency") frequency = Number(part.value);
			}
		}

		if (!size || !geo || !creativeUrl) {
			return reply.badRequest("Всі поля обовʼязкові");
		}

		const saved = await saveLineItem(fastify, {
			size,
			minCpm,
			maxCpm,
			geo,
			adType,
			frequency,
			creativeUrl,
		});
		return { success: true, saved };
	});

	fastify.post("/adServer/bid", async (req, reply) => {
		const { size, geo, cpm } = req.body as {
			size: string;
			geo: string;
			cpm: number;
		};

		const item = await getMatchingLineItem(fastify, { size, geo, cpm });

		if (!item) {
			return reply.code(204).send();
		}

		return {
			id: item.id,
			ad: `<img src="${item.creativeUrl}" width="${item.size.split("x")[0]}" height="${item.size.split("x")[1]}" />`,
			cpm: cpm,
			currency: "USD",
		};
	});
};

export default adServerController;
