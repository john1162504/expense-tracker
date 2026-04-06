import { categoryRepository } from "@/modules/category/category.repository.js";

export const categoryService = {
    async getCategories(userId: number) {
        const categories = await categoryRepository.getCategories(userId);
        return categories;
    },
};
