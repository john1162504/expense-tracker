import { getPrisma } from "@/config/prisma";
import { UnfoundError } from "@/errors/UnfoundError";
import { CreateExpenseInput } from "@expense-tracker/shared";

const prisma = getPrisma();

export const expenseRepository = {
    async createExpense(userId: number, data: CreateExpenseInput) {
        return await prisma.expense.create({
            data: {
                amount: data.amount,
                description: data.description,
                categoryId: data.categoryId,
                userId: userId,
            },
        });
    },

    async getUserExpenses(userId: number) {
        return await prisma.expense.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                categoryId: true,
                amount: true,
                description: true,
                createdAt: true,
            },
        });
    },

    async updateExpense(
        expenseId: string,
        userId: number,
        data: Partial<CreateExpenseInput>,
    ) {
        const updated = await prisma.expense.updateMany({
            where: {
                id: expenseId,
                userId: userId,
            },
            data: { ...data },
        });

        if (updated.count === 0) {
            throw new UnfoundError("Expense not found or not owned by user");
        }
    },
};
