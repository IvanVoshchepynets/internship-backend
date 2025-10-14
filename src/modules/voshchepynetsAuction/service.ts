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
  } catch (err: any) {
  fastify.log.error("DB save error:", err);
  console.error("Prisma error details:", err); 
  throw err; 
}
}

export async function saveCreative(file: any): Promise<string> {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.filename);

  await new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    file.file.pipe(ws);
    file.file.on("end", resolve);
    file.file.on("error", reject);
  });

  return `/uploads/${file.filename}`;
}

export async function getMatchingLineItem(
  fastify: FastifyInstance,
  { size, geo, cpm }: { size: string; geo: string; cpm: number },
): Promise<LineItem | null> {
  return fastify.prisma.lineItem.findFirst({
    where: {
      size,
      geo: { contains: geo },
      minCpm: { lte: cpm },
      maxCpm: { gte: cpm },
    },
  });
}
