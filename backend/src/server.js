import express from "express";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import repositoryIntelligenceRoutes from "./routes/repositoryIntelligenceRoutes.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS origin is not allowed")
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/repository", repositoryRoutes);
app.use("/api/repository-intelligence", repositoryIntelligenceRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ai-developer-toolbox-api",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "AI Developer Toolbox API is running",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();