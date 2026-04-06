import { z } from "zod";

export const ExpenseSchema = z.object({
    amount: z
        .string()
        .regex(
            /^\d+(\.\d{1,2})?$/,
            "Amount must be a valid number with up to 2 decimal places",
        ),
    description: z.string().min(1).max(255).optional(),
    createdAt: z
        .string()
        .refine((createdAt) => !isNaN(Date.parse(createdAt)), {
            message: "Invalid date format",
        })
        .optional(),
    categoryId: z.number(),
});
export type Expense = z.infer<typeof ExpenseSchema>;
