import { FastifyPluginAsync } from "fastify";
import { parseFeed } from "../../services/feedParser";
import { getAllFeeds } from "../../services/dbService";

const feedRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/feed", async (request, reply) => {
    const { url, force } = request.query as { url?: string; force?: string };

    const feedUrl =
      url || "https://www.pravda.com.ua/rss/view_news";
    const forceFlag = force === "1" ? 1 : 0;

    try {
      const feed = await parseFeed(fastify, feedUrl, forceFlag);
      return feed;
    } catch (err) {
      fastify.log.error(err);
      return reply.internalServerError("Не вдалося отримати фід");
    }
  });

  fastify.get("/feeds", async () => {
    return getAllFeeds(fastify);
  });
};

export default feedRoute;
