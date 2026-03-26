import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
} from "@/modules/auth/auth.controller.js";
import { validate } from "@/middlewares/validator.js";
import { RegisterSchema, LoginSchema } from "@expense-tracker/shared";
import { requireRefreshToken } from "@/middlewares/RequireRefreshToken.js";

const router = Router();

router.post("/register", validate(RegisterSchema), registerUser);
router.post("/login", validate(LoginSchema), loginUser);
router.post("/logout", requireRefreshToken, logoutUser);
router.post("/refresh", requireRefreshToken, refreshToken);

export default router;
