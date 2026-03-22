import { CookieOptions, Request, Response } from "express";
import { authService } from "@/modules/auth/auth.service.js";
import { signAccessToken, signRefreshToken } from "../../shared/utils/jwt.js";
import { AuthenticatedRequest } from "@/shared/middlewares/Authenticate.js";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
};

//register user
const registerUser = async (req: Request, res: Response) => {
    const newUser = await authService.register(req.body);
    return res.status(201).json({ success: true, id: newUser.id });
};

//login user
const loginUser = async (req: Request, res: Response) => {
    const user = await authService.login(req.body);

    const accessToken = signAccessToken({
        userId: user.id,
        jti: crypto.randomUUID(),
    });
    const refreshToken = signRefreshToken({
        userId: user.id,
        jti: crypto.randomUUID(),
    });

    await authService.storeRefreshToken(refreshToken, user.id);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({ success: true, user, accessToken });
};

const logoutUser = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    await authService.deleteRefreshToken(token);

    res.clearCookie("refreshToken", {
        path: "/api/auth",
    });
    return res.sendStatus(204);
};

const refreshToken = async (req: Request, res: Response) => {
    // check token existence and validity is done in middleware by requireRefreshToken

    //check if token is in db and is not expired
    const refreshToken = req.cookies.refreshToken;

    await authService.validateRefreshToken(refreshToken);

    //delte old token and generate then save it in db and send new access token to client

    await authService.deleteRefreshToken(refreshToken);

    const newRefreshToken = signRefreshToken({
        userId: (req as AuthenticatedRequest).user.id,
        jti: crypto.randomUUID(),
    });

    await authService.storeRefreshToken(
        newRefreshToken,
        (req as AuthenticatedRequest).user.id,
    );
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    const newAccessToken = signAccessToken({
        userId: (req as AuthenticatedRequest).user.id,
        jti: crypto.randomUUID(),
    });
    return res.status(200).json({ success: true, accessToken: newAccessToken });
};

export { registerUser, loginUser, logoutUser, refreshToken };
