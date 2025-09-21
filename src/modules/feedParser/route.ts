import { FastifyPluginAsync } from "fastify";
import { parseFeed } from "../../services/feedParser";
import { getAllFeeds } from "../../services/dbService";

const feedRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get(
    "/feed",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            url: { type: "string" },
            force: { type: "integer", enum: [0, 1], default: 0 },
          },
        },
      },
    },
    async (request, reply) => {
      const { url, force } = request.query as { url?: string; force: number };

      const feedUrl = url || "https://www.pravda.com.ua/rss/view_news";

      try {
        const feed = await parseFeed(fastify, feedUrl, force);
        return feed;
      } catch (err) {
        fastify.log.error(err);
        return reply.internalServerError("Не вдалося отримати фід");
      }
    },
  );

  fastify.get("/feeds", async () => {
    return getAllFeeds(fastify);
  });
};

export default feedRoute;