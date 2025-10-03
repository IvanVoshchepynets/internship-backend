import { type ClickHouseClient, createClient } from "@clickhouse/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const DB_NAME = "mydb";

export default fp(
  async (fastify: FastifyInstance) => {
    const client: ClickHouseClient = createClient({
      host: process.env.CLICKHOUSE_HOST || "http://localhost:8123",
      username: process.env.CLICKHOUSE_USER || "default",
      password: process.env.CLICKHOUSE_PASSWORD || "mypassword",
      database: DB_NAME,
    });

    try {
      await client.exec({
        query: `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
      });

      await client.exec({
        query: `
          CREATE TABLE IF NOT EXISTS ${DB_NAME}.stats (
            event String,
            timestamp DateTime,
            pageUrl String,
            adapter Nullable(String),
            creativeId Nullable(String),
            cpm Nullable(Float64),
            geo Nullable(String)
          )
          ENGINE = MergeTree()
          ORDER BY (timestamp, event)
        `,
      });

      fastify.log.info("ClickHouse database and stats table initialized");
    } catch (err) {
      fastify.log.error({ err }, "Failed to initialize ClickHouse");
      throw err;
    }

    fastify.decorate("clickhouse", client);

    fastify.addHook("onClose", async () => {
      await client.close();
      fastify.log.info("ClickHouse connection closed");
    });
  },
  {
    name: "clickhouse-plugin",
  },
);

declare module "fastify" {
  interface FastifyInstance {
    clickhouse: ClickHouseClient;
  }
}