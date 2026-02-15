import { Request, Response } from "express";
import { authService } from "@/modules/auth/auth.service";
import { requireUser } from "@/shared/middlewares/requireUser";

//register user
const registerUser = async (req: Request, res: Response) => {
    const newUser = await authService.register(req.body);
    return res.status(201).json({ id: newUser.id });
};

//login user
const loginUser = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
};

//get user info
const getUserInfo = async (req: Request, res: Response) => {
    requireUser(req);
    const user = await authService.getUserInfo(req.user!.id);
    return res.status(200).json(user);
};

//update user info
const updateUser = async (req: Request, res: Response) => {
    requireUser(req);
    const updatedUser = await authService.updateUser(req.user!.id, req.body);
    return res.status(200).json(updatedUser);
};

//delete user account
const deleteUser = async (req: Request, res: Response) => {
    requireUser(req);
    await authService.deleteUser(req.user!.id);
    return res.status(204).send();
};

export { registerUser, loginUser, getUserInfo, updateUser, deleteUser };
