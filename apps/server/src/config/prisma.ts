// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
    // allow global `var` for hot-reload in dev
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
    if (process.env.NODE_ENV === "production") {
        if (!prisma) {
            prisma = new PrismaClient();
        }
        return prisma;
    } else {
        if (!global.prisma) {
            global.prisma = new PrismaClient();
        }
        return global.prisma;
    }
}
