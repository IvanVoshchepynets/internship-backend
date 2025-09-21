import retry from "async-retry";
import type { FastifyInstance } from "fastify";
import Parser from "rss-parser";
import { getFeedByUrl, upsertFeed } from "./dbService";

const parser = new Parser();

export async function parseFeed(
	fastify: FastifyInstance,
	url: string,
	force = 0,
) {
	return retry(
		async () => {
			if (!force) {
				const existing = await getFeedByUrl(fastify, url);
				if (existing) return existing;
			}

			const feed = await parser.parseURL(url);

			if (!feed.items || feed.items.length === 0) {
				throw new Error("Feed is empty or invalid");
			}

			const firstItem = feed.items[0];

			const savedFeed = await upsertFeed(fastify, {
				title: firstItem.title || "Без назви",
				link: firstItem.link || url,
				pubDate: firstItem.pubDate ? new Date(firstItem.pubDate) : new Date(),
				preview: firstItem.contentSnippet || "",
			});

			return savedFeed;
		},
		{ retries: 3 },
	);
}
