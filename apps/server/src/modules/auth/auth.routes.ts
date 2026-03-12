import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
} from "@/modules/auth/auth.controller";
import { validate } from "@/shared/middlewares/validator";
import { RegisterSchema, LoginSchema } from "@/modules/auth/auth.schema";
import { requireRefreshToken } from "@/shared/middlewares/RequireRefreshToken";

const router = Router();

router.post("/register", validate(RegisterSchema), registerUser);
router.post("/login", validate(LoginSchema), loginUser);
router.post("/logout", requireRefreshToken, logoutUser);
router.post("/refresh", requireRefreshToken, refreshToken);

export default router;
