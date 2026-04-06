import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoutes from "@/modules/auth/auth.routes.js";
import CategoryRoutes from "@/modules/category/category.route.js";
import { errorHandler } from "@/middlewares/ErrorHandler.js";
import pinoHttp from "pino-http";
import logger from "@/utils/logger.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger, autoLogging: true }));
app.use("/api/auth", AuthRoutes);
app.use("/api/categories", CategoryRoutes);
app.use(errorHandler);

app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

export { app };
