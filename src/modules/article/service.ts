import * as cheerio from "cheerio";

export async function parseArticle(url: string) {
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
		const html = await res.text();

		const $ = cheerio.load(html);

		const title = $("h1").first().text() || "Without title";
		const paragraphs = $("p")
			.map((_, el) => $(el).text())
			.get();
		const images = $("img")
			.map((_, el) => $(el).attr("src"))
			.get();

		return {
			title,
			content: paragraphs.slice(0, 5),
			images,
		};
	} catch (err) {
		throw new Error(`Article parsing failed for ${url}: ${err}`);
	}
}
