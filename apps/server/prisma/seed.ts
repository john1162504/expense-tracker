import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/encryptor.js";

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

    const testUserEmail = "test@test.com";
    const testUser = await prisma.user.findUnique({
        where: { email: testUserEmail },
    });
    let user;

    if (!testUser) {
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email: testUserEmail,
                password: await hashPassword("password"),
            },
        });
        console.log(`✅ Test user with email ${testUserEmail} seeded`);
    } else {
        user = testUser;
    }

    const categoryIds = await prisma.category.findMany({
        where: { userId: null },
        select: { id: true },
    });

    function getRandomCategoryId() {
        const randomIndex = Math.floor(Math.random() * categoryIds.length);
        return categoryIds[randomIndex].id;
    }

    const existingExpenses = await prisma.expense.count({
        where: { userId: user.id },
    });

    if (existingExpenses === 0) {
        const sampleExpenses = [
            { amount: 42.4, description: "Grocery shopping" },
            { amount: 15.5, description: "Bus ticket" },
            { amount: 60, description: "Electricity bill" },
            { amount: 1200, description: "Monthly rent" },
            { amount: 50, description: "Movie night" },
        ];

        for (const expense of sampleExpenses) {
            await prisma.expense.create({
                data: {
                    amount: expense.amount,
                    description: expense.description,
                    categoryId: getRandomCategoryId(), // ✅ correct
                    userId: user.id,
                },
            });
        }

        console.log(`✅ Sample expenses seeded for user ${testUserEmail}`);
    } else {
        console.log("ℹ️ Expenses already exist, skipping seed");
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
