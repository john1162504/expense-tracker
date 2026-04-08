import { getPrisma } from "@/config/prisma.js";

const prisma = getPrisma();

export const categoryRepository = {
    async getCategories(userId: number) {
        return await prisma.category.findMany({
            where: { userId },
        });
    },

    async getCategoryById(categoryId: string) {
        return await prisma.category.findFirst({
            where: {
                id: categoryId,
            },
        });
    },
};
