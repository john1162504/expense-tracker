import { Router } from "express";
import {
    registerUser,
    loginUser,
    getUserInfo,
    updateUser,
    deleteUser,
} from "@/controllers/UserController";
import { validate } from "@/middlewares/Validator";
import { authenticate } from "@/middlewares/Authenticate";
import {
    RegisterSchema,
    LoginSchema,
    UpdateUserSchema,
} from "@/schemas/user.schema";
import { userService } from "@/services/userServiceImpl";

const router = Router();

router.post("/register", validate(RegisterSchema), registerUser(userService));
router.post("/login", validate(LoginSchema), loginUser(userService));
router.get("/me", authenticate, getUserInfo(userService));
router.put(
    "/me",
    authenticate,
    validate(UpdateUserSchema),
    updateUser(userService)
);
router.delete("/me", authenticate, deleteUser(userService));

export default router;
