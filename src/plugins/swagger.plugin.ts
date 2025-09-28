import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
	await fastify.register(swagger, {
		openapi: {
			info: {
				title: "Feed API",
				description: "Documentation API for internship-backend",
				version: "1.0.0",
			},
		},
	});

	await fastify.register(swaggerUi, {
		routePrefix: "/docs",
		staticCSP: true,
		transformStaticCSP: (header) => header,
		uiConfig: {
			docExpansion: "list",
			deepLinking: false,
		},
	});

	fastify.log.info("Swagger UI available за /docs");
});
