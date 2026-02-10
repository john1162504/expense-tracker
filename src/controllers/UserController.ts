import { Request, Response } from "express";
import { UserService } from "@/services/UserService";
import { requireUser } from "@/middlewares/requireUser";

//register user
const registerUser =
    (userService: UserService) => async (req: Request, res: Response) => {
        const newUser = await userService.register(req.body);
        return res.status(201).json({ id: newUser.id });
    };

//login user
const loginUser =
    (userService: UserService) => async (req: Request, res: Response) => {
        const result = await userService.login(req.body);
        return res.status(200).json(result);
    };

//get user info
const getUserInfo =
    (userService: UserService) => async (req: Request, res: Response) => {
        requireUser(req);
        const user = await userService.getUserInfo(req.user!.id);
        return res.status(200).json(user);
    };

//update user info
const updateUser =
    (userService: UserService) => async (req: Request, res: Response) => {
        requireUser(req);
        const updatedUser = await userService.updateUser(
            req.user!.id,
            req.body,
        );
        return res.status(200).json(updatedUser);
    };

//delete user account
const deleteUser =
    (userService: UserService) => async (req: Request, res: Response) => {
        requireUser(req);
        await userService.deleteUser(req.user!.id);
        return res.status(204).send();
    };

export { registerUser, loginUser, getUserInfo, updateUser, deleteUser };
