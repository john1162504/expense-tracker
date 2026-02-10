import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/ErrorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", UserRoutes);
app.use(errorHandler);

app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

export { app };
