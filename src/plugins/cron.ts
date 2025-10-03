import fp from "fastify-plugin";
import { fastifySchedule } from "@fastify/schedule";
import { SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import { parseFeed } from "../services/feedParser";

export default fp(async (fastify) => {
  fastify.log.info("Cron plugin registered");

  await fastify.register(fastifySchedule);

  fastify.ready().then(() => {
    const task = new AsyncTask(
      "feed-update-task",
      async () => {
        try {
          const DEFAULT_FEED_URL = "https://www.pravda.com.ua/rss/view_news";
          await parseFeed(fastify, DEFAULT_FEED_URL, 1);
          fastify.log.info("Feed updated by cron (schedule)");
        } catch (err) {
          fastify.log.error("Cron schedule feed update failed", err);
        }
      }
    );

    const job = new SimpleIntervalJob(
      { minutes: 5 },
      task
    );

    fastify.scheduler.addSimpleIntervalJob(job);
  });
});