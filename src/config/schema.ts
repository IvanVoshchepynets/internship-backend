import type { FromSchema } from "json-schema-to-ts";

export const EnvSchema = {
  type: "object",
  properties: {
    PORT: { type: "string", default: "3000" },
    HOST: { type: "string", default: "0.0.0.0" },
  },
  required: ["PORT", "HOST"],
  additionalProperties: false,
} as const;

export type Config = FromSchema<typeof EnvSchema>;
