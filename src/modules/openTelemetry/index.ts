import type { FastifyInstance } from "fastify";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import {
  ConsoleLogRecordExporter,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

import { FsInstrumentation } from "@opentelemetry/instrumentation-fs";
import { MongoDBInstrumentation } from "@opentelemetry/instrumentation-mongodb";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import * as dotenv from "dotenv";

dotenv.config();

const OpenTelemetryModule = async (fastify: FastifyInstance) => {
  const otelEnabled = process.env.ENABLE_OTEL?.toLowerCase() === "true";

  if (!otelEnabled) {
    fastify.log.info("ℹ️ OpenTelemetry вимкнено (ENABLE_OTEL=false)");
    return; 
  }

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

  const serviceName =
    process.env.OTEL_SERVICE_NAME ||
    process.env.npm_package_name ||
    "feed-backend";

  const resource = resourceFromAttributes({
    "service.name": serviceName,
    "deployment.environment": process.env.NODE_ENV || "development",
  });

  const spanExporter = new ConsoleSpanExporter();
  const metricExporter = new ConsoleMetricExporter();
  const logExporter = new ConsoleLogRecordExporter();

  const sdk = new NodeSDK({
    resource,
    traceExporter: spanExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: Number(process.env.OTEL_EXPORT_INTERVAL) || 2000,
    }),
    logRecordProcessors: [new SimpleLogRecordProcessor(logExporter as any)],
    instrumentations: [
      new HttpInstrumentation(),
      new FsInstrumentation(),
      new MongoDBInstrumentation(),
      new PinoInstrumentation({
        logHook: (span, record) => {
          if (span && record) {
            span.setAttribute("log.level", String(record.level));
          }
        },
      }),
    ],
  });

  try {
    await sdk.start();
    fastify.log.info("OpenTelemetry SDK started (Console exporters).");
  } catch (err) {
    fastify.log.error({ err }, "Failed to start OpenTelemetry SDK");
  }

  fastify.decorate("otelSdk", sdk);

  fastify.addHook("onClose", async () => {
    try {
      await sdk.shutdown();
      fastify.log.info("OpenTelemetry SDK shutdown complete.");
    } catch (err) {
      fastify.log.error({ err }, "Error shutting down OpenTelemetry SDK.");
    }
  });
};

export default OpenTelemetryModule;

declare module "fastify" {
  interface FastifyInstance {
    otelSdk?: NodeSDK;
  }
}