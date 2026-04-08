import { Request, Response } from "express";
import { expenseService } from "@/modules/expense/expense.service.js";
import { AuthenticatedRequest } from "@/middlewares/Authenticate";

const getExpenses = async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const expenses = await expenseService.getExpenses(userId);
    return res.status(200).json({ success: true, expenses });
};

const createExpense = async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const newExpense = await expenseService.createExpense(userId, req.body);
    return res.status(201).json({ success: true, expense: newExpense });
};

const updateExpense = async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    await expenseService.updateExpense(
        req.params.id.toString(),
        userId,
        req.body,
    );
    return res.status(200).json({ success: true });
};

export { getExpenses, createExpense, updateExpense };
