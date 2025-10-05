import type { FastifyInstance } from "fastify";
import type { NodeSDK } from "@opentelemetry/sdk-node";

export default async function attachShutdownHook(
  fastify: FastifyInstance,
  sdk: NodeSDK | null,
): Promise<void> {
  if (!sdk) return;

  fastify.addHook("onClose", async () => {
    try {
      await sdk.shutdown();
      fastify.log.info("OpenTelemetry SDK shutdown complete.");
    } catch (err) {
      fastify.log.error({ err }, "OpenTelemetry SDK shutdown failed.");
    }
  });
}