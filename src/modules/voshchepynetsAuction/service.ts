import type { LineItem } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

type CreateLineItemInput = Omit<LineItem, "id" | "createdAt">;

export async function saveLineItem(
	fastify: FastifyInstance,
	data: CreateLineItemInput,
): Promise<LineItem> {
	try {
		const saved = await fastify.prisma.lineItem.create({ data });
		fastify.log.info({ lineItem: saved }, "Line item saved");
		return saved;
	} catch (err) {
		fastify.log.error("DB save error:", err);
		throw new Error("DB error");
	}
}

export function saveCreative(file: any): string {
	const uploadDir = path.join(process.cwd(), "uploads");
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const filePath = path.join(uploadDir, file.filename);
	const ws = fs.createWriteStream(filePath);
	file.file.pipe(ws);

	return `/uploads/${file.filename}`;
}

export async function getMatchingLineItem(
	fastify: FastifyInstance,
	criteria: {
		size: string;
		geo: string;
		cpm: number;
	},
): Promise<LineItem | null> {
	return fastify.prisma.lineItem.findFirst({
		where: {
			size: criteria.size,
			geo: { contains: criteria.geo },
			minCpm: { lte: criteria.cpm },
			maxCpm: { gte: criteria.cpm },
		},
	});
}
