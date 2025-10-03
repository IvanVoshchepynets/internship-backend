import type { FastifyInstance } from "fastify";

export interface StatEvent {
  event: string;
  timestamp: number;
  pageUrl: string;
  adapter?: string;
  creativeId?: string;
  cpm?: number;
  geo?: string;
}

let buffer: StatEvent[] = [];
let lastFlush = Date.now();
const MAX_BUFFER = 1;       
const MAX_INTERVAL = 1000;  

export async function saveEvent(
  fastify: FastifyInstance,
  events: StatEvent | StatEvent[],
) {
  const arr = Array.isArray(events) ? events : [events];
  buffer.push(...arr);

  const now = Date.now();
  if (buffer.length >= MAX_BUFFER || now - lastFlush > MAX_INTERVAL) {
    await flushToClickHouse(fastify);
    lastFlush = now;
  }
}

async function flushToClickHouse(fastify: FastifyInstance) {
  if (buffer.length === 0) return;
  const values = buffer.map((e) => ({
    event: e.event,
    timestamp: new Date(Math.floor(e.timestamp / 1000) * 1000),
    pageUrl: e.pageUrl,
    adapter: e.adapter ?? null,
    creativeId: e.creativeId ?? null,
    cpm: e.cpm ?? null,
    geo: e.geo ?? null,
  }));

  try {
    await fastify.clickhouse.insert({
      table: "stats",
      values,
      format: "JSONEachRow",
    });
    fastify.log.info(`Flushed ${buffer.length} stats events to ClickHouse`);
    buffer = [];
  } catch (err: any) {
    fastify.log.error({ err, values }, "ClickHouse insert failed");
  }
}

export async function queryStats(fastify: FastifyInstance, params: any) {
  const {
    date_from,
    date_to,
    events,
    adapter,
    cpm_from,
    cpm_to,
    limit = 50,
    offset = 0,
    format = "json",
  } = params;

  const conditions: string[] = [];
  if (date_from) conditions.push(`timestamp >= toDateTime('${date_from}')`);
  if (date_to) conditions.push(`timestamp <= toDateTime('${date_to}')`);
  if (events)
    conditions.push(
      `event IN (${events
        .split(",")
        .map((e: string) => `'${e}'`)
        .join(",")})`,
    );
  if (adapter) conditions.push(`adapter = '${adapter}'`);
  if (cpm_from) conditions.push(`cpm >= ${Number(cpm_from)}`);
  if (cpm_to) conditions.push(`cpm <= ${Number(cpm_to)}`);

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT
      event,
      timestamp,
      pageUrl,
      adapter,
      creativeId,
      cpm,
      geo
    FROM stats
    ${where}
    ORDER BY timestamp DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const result = await fastify.clickhouse.query({
    query,
    format: format === "csv" ? "CSV" : "JSON",
  });

  return format === "csv" ? result.text() : result.json();
}