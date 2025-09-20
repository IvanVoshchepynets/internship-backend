import { FastifyInstance } from "fastify";

export async function upsertFeed(
  fastify: FastifyInstance,
  data: {
    title: string;
    link: string;
    pubDate: Date;
    preview: string;
  }
) {
  return fastify.prisma.feed.upsert({
    where: { link: data.link },
    update: {
      title: data.title,
      pubDate: data.pubDate,
      preview: data.preview,
    },
    create: data,
  });
}

export async function getFeedByUrl(fastify: FastifyInstance, url: string) {
  return fastify.prisma.feed.findUnique({
    where: { link: url },
  });
}

export async function getAllFeeds(fastify: FastifyInstance) {
  return fastify.prisma.feed.findMany({
    orderBy: { pubDate: "desc" },
  });
}
