import { CreateExpenseInput } from "@expense-tracker/shared";
import { expenseRepository } from "@/modules/expense/expense.repository.js";
import { categoryRepository } from "../category/category.repository";
import { InvalidRequest } from "@/errors/InvalidRequest";
import { ExpenseDTO } from "@expense-tracker/shared";

async function validateCategoryOwnership(categoryId: string, userId: number) {
    const category = await categoryRepository.getCategoryById(categoryId);
    if (!category || (category.userId != null && category.userId !== userId)) {
        throw new InvalidRequest("Invalid category");
    }
}

export const expenseService = {
    async getExpenses(userId: number): Promise<ExpenseDTO[]> {
        const expenses = await expenseRepository.getUserExpenses(userId);
        return expenses.map((e: any) => ({
            id: e.id,
            amount: e.amount.toNumber(),
            description: e.description ?? undefined,
            createdAt: e.createdAt,
            categoryId: e.categoryId,
        }));
    },

    async createExpense(userId: number, data: CreateExpenseInput) {
        await validateCategoryOwnership(data.categoryId, userId);

        return await expenseRepository.createExpense(userId, data);
    },

    async updateExpense(
        expenseId: string,
        userId: number,
        data: Partial<CreateExpenseInput>,
    ) {
        if (data.categoryId) {
            await validateCategoryOwnership(data.categoryId, userId);
        }
        await expenseRepository.updateExpense(expenseId, userId, data);
    },
};
