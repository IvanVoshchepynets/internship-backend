import { FastifyPluginAsync } from "fastify";
import { feedParser } from "../../services/feedParser";
import { dbService } from "../../services/dbService";

const feedRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get("/feed", async (request, reply) => {
    const { url, force } = request.query as { url?: string; force?: string };

    const feedUrl =
      url || "https://www.pravda.com.ua/rss/view_news"; 
    const forceFlag = force === "1" ? 1 : 0;

    try {
      const parser = feedParser(fastify);
      const feed = await parser.parseFeed(feedUrl, forceFlag);
      return feed;
    } catch (err) {
      fastify.log.error(err);
      return reply.internalServerError("Не вдалося отримати фід");
    }
  });

  fastify.get("/feeds", async () => {
    const db = dbService(fastify);
    return db.getAllFeeds();
  });
};

export default feedRoute;
