import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        "Food",
        "Transport",
        "Utilities",
        "Rent",
        "Entertainment",
        "Shopping",
        "Subscriptions",
    ];

    for (const name of categories) {
        const exists = await prisma.category.findFirst({
            where: {
                name,
                userId: null,
            },
        });

        if (!exists) {
            await prisma.category.create({
                data: {
                    name,
                    userId: null,
                },
            });
        }

        console.log(`✅ Categories: ${name} seeded`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
