import express from "express";
import cors from "cors";
import UserRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/middlewares/ErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", UserRoutes);
app.use(errorHandler);

app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

export { app };
