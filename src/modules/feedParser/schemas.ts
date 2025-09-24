export const getFeedSchema = {
	querystring: {
		type: "object",
		properties: {
			url: { type: "string" },
			force: { type: "integer", enum: [0, 1], default: 0 },
		},
	},
} as const;
