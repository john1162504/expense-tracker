import { Request, Response } from "express";
import { categoryService } from "@/modules/category/category.service.js";
import { AuthenticatedRequest } from "@/middlewares/Authenticate";

const getCategories = async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories(
        (req as AuthenticatedRequest).user.id,
    );
    return res.status(200).json({ success: true, categories });
};

export { getCategories };
