import multipart from "@fastify/multipart";
import type { FastifyPluginAsync } from "fastify";
import { formHtml } from "./page";
import { getMatchingLineItem, saveCreative, saveLineItem } from "./service";

const adServerController: FastifyPluginAsync = async (fastify) => {
	await fastify.register(multipart);

	fastify.get("/form", async (_, reply) => {
		reply.type("text/html").send(formHtml);
	});

	fastify.post("/form", async (req, reply) => {
		const parts = req.parts();

		const formData: Record<string, any> = {};

		for await (const part of parts) {
			if (part.type === "file") {
				formData.creativeUrl = saveCreative(part);
			} else if (part.type === "field") {
				const { fieldname, value } = part;
				formData[fieldname] = value;
			}
		}

		const { size, minCpm, maxCpm, geo, adType, frequency, creativeUrl } = {
			size: formData.size as string,
			minCpm: Number(formData.minCpm || 0),
			maxCpm: Number(formData.maxCpm || 0),
			geo: formData.geo as string,
			adType: formData.adType as string,
			frequency: Number(formData.frequency || 0),
			creativeUrl: formData.creativeUrl as string,
		};

		if (!size || !geo || !creativeUrl) {
			return reply.badRequest("All fields are required");
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

	fastify.post("/bid", async (req, reply) => {
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
			cpm,
			currency: "USD",
		};
	});
};

export default adServerController;
