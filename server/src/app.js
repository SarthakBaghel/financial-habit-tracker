import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
