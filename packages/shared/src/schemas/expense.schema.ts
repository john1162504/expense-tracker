import { z } from "zod";

export const ExpenseSchema = z.object({
    expenseId: z.string(),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
    description: z.string().min(1).max(255).optional(),
    createdAt: z.date(),
    categoryId: z.string(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

export const CreateExpenseSchema = z.object({
    amount: z
        .string()
        .regex(
            /^\d+(\.\d{1,2})?$/,
            "Amount must be a valid number with up to 2 decimal places",
        ),
    description: z.string().min(1).max(255).optional(),
    categoryId: z.string(),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
