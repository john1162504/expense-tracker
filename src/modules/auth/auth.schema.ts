import { z } from "zod";

export const PubilicUerSchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(100),
    email: z.email(),
});

export type PublicUser = z.infer<typeof PubilicUerSchema>;

export const RegisterSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(8).max(30),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(30),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UpdateUserSchema = z.object({
    name: z.string().min(1).max(100),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
