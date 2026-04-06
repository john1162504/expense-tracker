import { z } from "zod";

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(100),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
    name: z.string().min(1).max(100),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
