import { requireAccessToken } from "@/middlewares/RequireAccessToken";
import { validate } from "@/middlewares/validator";
import { CreateExpenseSchema } from "@expense-tracker/shared";
import { Router } from "express";
import {
    createExpense,
    getExpenses,
    updateExpense,
} from "./expense.controller";

const router = Router();

router.get("/expenses", requireAccessToken, getExpenses);

router.post(
    "/expenses",
    validate(CreateExpenseSchema),
    requireAccessToken,
    createExpense,
);

router.put(
    "/expenses/:id",
    validate(CreateExpenseSchema.partial()),
    requireAccessToken,
    updateExpense,
);

export default router;
