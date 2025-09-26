import fp from "fastify-plugin";
import cron from "node-cron";
import { parseFeed } from "../services/feedParser";

export default fp(async (fastify) => {
  fastify.log.info("Cron plugin registered");

  cron.schedule("*/5 * * * *", async () => {
    try {
      const DEFAULT_FEED_URL = "https://www.pravda.com.ua/rss/view_news";
      await parseFeed(fastify, DEFAULT_FEED_URL, 1); 
      fastify.log.info("Feed updated by cron");
    } catch (err) {
      fastify.log.error("Cron feed update failed", err);
    }
  });
});
