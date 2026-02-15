import { app } from "App";
import { getPrisma } from "./config/prisma";
import logger from "@/shared/utils/logger";

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        const prisma = getPrisma();
        await prisma.$connect();
        logger.info("✅ Prisma connected!");
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        logger.error(err, "❌ Prisma connection failed:");
    }
}

main();
