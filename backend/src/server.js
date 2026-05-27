import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({
//   path: path.resolve(__dirname, "../.env"),
// });
// import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://ai-developer-toolbox-czp6.vercel.app",
  "https://ai-developer-toolbox-mnwa.vercel.app",
],
  })
);
app.use(express.json());

// Routes
app.use("/api/ai", aiRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    message: "AI Developer Toolbox API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
