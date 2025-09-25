export const getArticleSchema = {
	querystring: {
		type: "object",
		properties: {
			url: { type: "string" },
		},
		required: ["url"],
	},
} as const;
