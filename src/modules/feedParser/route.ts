import type { FastifyPluginAsync } from "fastify";
import { getAllFeeds } from "../../services/dbService";
import { parseFeed } from "../../services/feedParser";

// ✅ Тепер ми використовуємо rss2json-проксі замість прямого доступу
const DEFAULT_FEED_URL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://rss.unian.net/site/news_ukr.rss";

const feedRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/feed", async (request, reply) => {
    const { url, force } = (request.query as any) || {};
    const feedUrl = url || DEFAULT_FEED_URL;

    try {
      const feed = await parseFeed(fastify, feedUrl, Number(force || 0));
      fastify.log.info(`✅ Feed fetched successfully: ${feedUrl}`);
      return feed;
    } catch (err) {
      fastify.log.error(`❌ Failed to fetch feed: ${feedUrl}`, err);
      return reply.internalServerError("Не вдалося отримати фід (UNIAN)");
    }
  });

  // ✅ Запасний маршрут — отримати всі новини з БД
  fastify.get("/feeds", async () => {
    fastify.log.info("Fetching all feeds from DB");
    return getAllFeeds(fastify);
  });
};

export default feedRoute;
