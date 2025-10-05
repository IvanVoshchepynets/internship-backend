export const postEventSchema = {
	body: {
		type: ["object", "array"],
		items: {
			type: "object",
			properties: {
				event: { type: "string" },
				timestamp: { type: "number" },
				pageUrl: { type: "string" },
				adapter: { type: ["string", "null"], nullable: true },
				creativeId: { type: ["string", "null"], nullable: true },
				cpm: { type: ["number", "null"], nullable: true },
				geo: { type: ["string", "null"], nullable: true },
			},
			required: ["event", "timestamp", "pageUrl"],
			additionalProperties: false,
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: { type: "boolean" },
			},
		},
	},
} as const;

export const getQuerySchema = {
	querystring: {
		type: "object",
		properties: {
			date_from: { type: "string", nullable: true },
			date_to: { type: "string", nullable: true },
			events: { type: "string", nullable: true },
			adapter: { type: "string", nullable: true },
			cpm_from: { type: "number", nullable: true },
			cpm_to: { type: "number", nullable: true },
			limit: { type: "integer", default: 100 },
			offset: { type: "integer", default: 0 },
			format: {
				type: "string",
				enum: ["json", "csv", "xlsx"],
				default: "json",
			},
		},
		additionalProperties: false,
	},
} as const;
