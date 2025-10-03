import type { FastifyPluginAsync } from "fastify";
import { getArticleSchema } from "./schemas";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { parseArticle } from "./service";

const articleRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  const route = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  route.get(
    "/article",
    { schema: getArticleSchema },
    async (request, reply) => {
      const { url } = request.query;

      try {
        const article = await parseArticle(url);
        fastify.log.info(`Parsed article from: ${url}`);
        return article;
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError("Failed to parse article");
      }
    },
  );
};

export default articleRoute;