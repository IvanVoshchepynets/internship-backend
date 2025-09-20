import { FastifyInstance } from "fastify";

export async function findByUrl(fastify: FastifyInstance, url: string) {
  return fastify.prisma.feed.findFirst({ where: { link: url } });
}

export async function createFeed(
  fastify: FastifyInstance,
  data: {
    title: string;
    link: string;
    pubDate: Date;
    preview: string;
  }
) {
  return fastify.prisma.feed.create({ data });
}

export async function getAllFeeds(fastify: FastifyInstance) {
  return fastify.prisma.feed.findMany({
    orderBy: { pubDate: "desc" },
  });
}