import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

const prisma = new PrismaClient();

export default fp(async (fastify) => {
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
