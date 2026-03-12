// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

let prisma: PrismaClient | null = null;

function getDatabaseUrl(): string {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is not defined");
    }
    return url;
}

export function getPrisma(): PrismaClient {
    if (prisma) return prisma;

    const adapter = new PrismaPg({
        connectionString: getDatabaseUrl(),
    });

    prisma = new PrismaClient({ adapter });

    return prisma;
}
