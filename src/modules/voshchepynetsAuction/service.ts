import type { LineItem } from "./types";

const lineItems: LineItem[] = [];

for (let i = 1; i <= 5; i++) {
	lineItems.push({
		id: `${i}`,
		size: "300x250",
		minCPM: 1,
		maxCPM: 5,
		geo: "UA",
		adType: "banner",
		frequency: 3,
		creativeUrl: `/creatives/test${i}.jpg`,
	});
}

export const voshchepynetsService = {
	getForm: () => {
		return {
			fields: [
				"size",
				"minCPM",
				"maxCPM",
				"geo",
				"adType",
				"frequency",
				"creative",
			],
		};
	},

	saveLineItem: (
		data: Omit<LineItem, "id" | "creativeUrl">,
		creativeFile: string,
	) => {
		const newItem: LineItem = {
			...data,
			id: Date.now().toString(),
			creativeUrl: `/creatives/${creativeFile}`,
		};
		lineItems.push(newItem);
		return newItem;
	},

	matchBidRequest: (geo: string, size: string) => {
		return lineItems.find((li) => li.geo === geo && li.size === size) || null;
	},
};
