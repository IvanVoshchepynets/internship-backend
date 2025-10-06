import type { FromSchema } from "json-schema-to-ts";

export const EnvSchema = {
	type: "object",
	properties: {
		PORT: { type: "string", default: "3000" },
		HOST: { type: "string", default: "0.0.0.0" },

		CLICKHOUSE_HOST: {
			type: "string",
			default: "http://localhost:8123",
		},
		CLICKHOUSE_USER: {
			type: "string",
			default: "default",
		},
		CLICKHOUSE_PASSWORD: {
			type: "string",
			default: "",
		},
		CLICKHOUSE_DB: {
			type: "string",
			default: "mydb",
		},
	},
	required: ["PORT", "HOST"],
	additionalProperties: true,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
