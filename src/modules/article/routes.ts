import axios from "axios";
import * as cheerio from "cheerio";
import type { FastifyPluginAsync } from "fastify";

const articleRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/article",
		{
			schema: {
				querystring: {
					type: "object",
					properties: {
						url: { type: "string" },
					},
					required: ["url"],
				},
			},
		},
		async (request, reply) => {
			const { url } = request.query as { url: string };

			try {
				const { data } = await axios.get(url);
				const $ = cheerio.load(data);

				const title = $("h1").first().text() || "Без назви";
				const paragraphs = $("p")
					.map((_, el) => $(el).text())
					.get();
				const images = $("img")
					.map((_, el) => $(el).attr("src"))
					.get();

				fastify.log.info(`Parsed article from: ${url}`);

				return {
					title,
					content: paragraphs.slice(0, 5),
					images,
				};
			} catch (error) {
				fastify.log.error(`Article parsing failed for ${url}:`, error);
				return reply.internalServerError("Не вдалося спарсити статтю");
			}
		},
	);
};

export default articleRoute;
