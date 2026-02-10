import { app } from "./app";
import { getPrisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        const prisma = getPrisma();
        await prisma.$connect();
        console.log("✅ Prisma connected!");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Prisma connection failed:", err);
    }
}

main();
