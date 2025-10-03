import Fastify from "fastify";
import app from "./app";

const server = Fastify({
	logger: true,
});

server.register(app);

const start = async () => {
	try {
		await server.listen({
			port: Number(process.env.PORT) || 3000,
			host: process.env.HOST || "0.0.0.0",
		});
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();