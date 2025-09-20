import Parser from "rss-parser";
import retry from "async-retry";
import { FastifyInstance } from "fastify";
import { findByUrl, createFeed } from "./dbService";

const parser = new Parser();

export async function parseFeed(
  fastify: FastifyInstance,
  url: string,
  force = 0
) {
  return retry(
    async () => {
      if (force === 0) {
        const existing = await findByUrl(fastify, url);
        if (existing) return existing;
      }

      const feed = await parser.parseURL(url);

      if (!feed.items || feed.items.length === 0) {
        throw new Error("Feed is empty or invalid");
      }

      const firstItem = feed.items[0];

      const newFeed = await createFeed(fastify, {
        title: firstItem.title || "Без назви",
        link: firstItem.link || url,
        pubDate: firstItem.pubDate ? new Date(firstItem.pubDate) : new Date(),
        preview: firstItem.contentSnippet || "",
      });

      return newFeed;
    },
    { retries: 3 }
  );
}