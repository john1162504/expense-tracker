import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserInfo,
    updateUser,
    deleteUser,
} from "@/modules/auth/auth.controller";
import { validate } from "@/shared/middlewares/validator";
import { authenticate } from "@/shared/middlewares/Authenticate";
import {
    RegisterSchema,
    LoginSchema,
    UpdateUserSchema,
} from "@/modules/auth/auth.schema";

const router = Router();

router.post("/register", validate(RegisterSchema), registerUser);
router.post("/login", validate(LoginSchema), loginUser);
router.get("/me", authenticate, getUserInfo);
router.put("/me", authenticate, validate(UpdateUserSchema), updateUser);
router.delete("/me", authenticate, deleteUser);

export default router;
