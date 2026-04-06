import { Router } from "express";
import { getCategories } from "@/modules/category/category.controller.js";
import { requireAccessToken } from "@/middlewares/RequireAccessToken.js";

const router = Router();

router.get("/categories", requireAccessToken, getCategories);

export default router;
