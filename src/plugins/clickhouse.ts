import { type ClickHouseClient, createClient } from "@clickhouse/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(
	async (fastify: FastifyInstance) => {
		const {
			CLICKHOUSE_HOST,
			CLICKHOUSE_USER,
			CLICKHOUSE_PASSWORD,
			CLICKHOUSE_DB,
		} = fastify.config;

		const client: ClickHouseClient = createClient({
			host: CLICKHOUSE_HOST,
			username: CLICKHOUSE_USER,
			password: CLICKHOUSE_PASSWORD,
			database: CLICKHOUSE_DB,
		});

		try {
			await client.exec({
				query: `CREATE DATABASE IF NOT EXISTS ${CLICKHOUSE_DB}`,
			});

			await client.exec({
				query: `
          CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_DB}.stats (
            event String,
            timestamp DateTime('Europe/Kiev') DEFAULT now('Europe/Kiev'),
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
	{ name: "clickhouse-plugin" },
);

declare module "fastify" {
	interface FastifyInstance {
		clickhouse: ClickHouseClient;
	}
}
