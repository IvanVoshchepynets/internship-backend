import Parser from "rss-parser";
import retry from "async-retry";
import { dbService } from "./dbService";
import { FastifyInstance } from "fastify";

const parser = new Parser();

export const feedParser = (fastify: FastifyInstance) => ({
  async parseFeed(url: string, force = 0) {
    return retry(
      async () => {
        const db = dbService(fastify);

        if (force === 0) {
          const existing = await db.findByUrl(url);
          if (existing) return existing;
        }

        const feed = await parser.parseURL(url);

        if (!feed.items || feed.items.length === 0) {
          throw new Error("Feed is empty or invalid");
        }

        const firstItem = feed.items[0];

        const newFeed = await db.createFeed({
          title: firstItem.title || "Без назви",
          link: firstItem.link || url,
          pubDate: firstItem.pubDate ? new Date(firstItem.pubDate) : new Date(),
          preview: firstItem.contentSnippet || "",
        });

        return newFeed;
      },
      { retries: 3 },
    );
  },
});
