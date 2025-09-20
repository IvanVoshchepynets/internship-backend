import type { FastifyInstance } from "fastify";

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health/server", async () => {
    return { status: "ok" };
  });

  fastify.get("/health/db", async () => {
    try {
      await fastify.prisma.feed.findFirst();
      return { status: "ok" };
    } catch (error) {
      fastify.log.error("DB health check failed:", error);
      return fastify.httpErrors.internalServerError(
        "Database connection failed"
      );
    }
  });
}
