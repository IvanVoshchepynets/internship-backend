import { FastifyInstance } from "fastify";

export const dbService = (fastify: FastifyInstance) => ({
  async findByUrl(url: string) {
    return fastify.prisma.feed.findFirst({ where: { link: url } });
  },

  async createFeed(data: {
    title: string;
    link: string;
    pubDate: Date;
    preview: string;
  }) {
    return fastify.prisma.feed.create({ data });
  },

  async getAllFeeds() {
    return fastify.prisma.feed.findMany({
      orderBy: { pubDate: "desc" },
    });
  },
});
