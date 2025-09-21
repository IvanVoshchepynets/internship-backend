import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    fastify.log.info("Connected to MongoDB via Prisma");
  } catch (err) {
    fastify.log.error("Failed to connect to MongoDB", err);
    throw err;
  }

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});