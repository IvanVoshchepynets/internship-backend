import Parser from "rss-parser";
import type { FastifyInstance } from "fastify";

function extractImageFromDescription(desc: string): string | null {
  const match = desc?.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
}

const parser = new Parser();

export async function parseFeed(fastify: FastifyInstance, feedUrl: string, force = 0) {
  try {
    const isAlreadyJson = feedUrl.includes("api.rss2json.com");
    const targetUrl = isAlreadyJson
      ? feedUrl
      : `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

    fastify.log.info(`🔍 Fetching feed from: ${targetUrl}`);

    const res = await fetch(targetUrl);
    fastify.log.info(`Response status: ${res.status}`);

    const text = await res.text();
    const data = JSON.parse(text);

    if (!data.items) {
      throw new Error("Відповідь не містить поля 'items'");
    }

    return data.items.map((item: any) => {
      const imageFromHTML = extractImageFromDescription(item.description || "");
      return {
        title: item.title || "Без назви",
        link: item.link || "#",
        preview: item.description?.replace(/<[^>]+>/g, "").slice(0, 300) || "",
        pubDate: item.pubDate || "",
        image:
          item.enclosure?.link ||
          item.thumbnail ||
          imageFromHTML ||
          "https://via.placeholder.com/600x400?text=No+Image",
      };
    });
  } catch (err: any) {
    fastify.log.error("FeedParser error:", err);
    throw new Error(`Не вдалося отримати фід (${feedUrl.includes("unian") ? "UNIAN" : feedUrl})`);
  }
}
