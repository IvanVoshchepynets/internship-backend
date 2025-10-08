export const getFeedSchema = {
  querystring: {
    type: "object",
    properties: {
      url: { type: "string", format: "uri" },
      force: { type: "integer", enum: [0, 1], default: 0 },
    },
    required: [],
    additionalProperties: false,
  },
} as const;

export type GetFeedQuery = {
  url?: string;
  force?: 0 | 1;
};
