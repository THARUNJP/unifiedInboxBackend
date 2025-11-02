import { PrismaClient,Prisma } from "@prisma/client";
import { appEnv } from "./env";

export const prisma = new PrismaClient({
  log: appEnv.env === "development"
    ? ["query", "info", "warn", "error"] // full logs in dev
    : ["warn", "error"], // minimal logs in production
});export type{Prisma}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

