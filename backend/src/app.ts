import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/comment.routes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/", commentRoutes);

app.use(errorHandler);

export default app;
