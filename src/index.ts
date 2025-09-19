import buildApp from "./app";

async function start() {
  try {
    const fastify = await buildApp({
      logger: true,
    });

    const port = fastify.config.PORT;
    const host = fastify.config.HOST;

    fastify.listen({ port, host }, (err, address) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Server running at ${address}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

void start();
