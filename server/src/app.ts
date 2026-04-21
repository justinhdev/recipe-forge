import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import openaiRoutes from "./routes/openai.routes";
import recipeRoutes from "./routes/recipe.routes";
import { errorHandler } from "./middleware/error.middleware";

export const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.get("/", (_req, res) => res.send("API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/ai", openaiRoutes);
app.use("/api/recipes", recipeRoutes);
app.use(errorHandler);
