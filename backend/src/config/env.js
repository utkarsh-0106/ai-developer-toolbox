import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export const env = {
  AI_PROVIDER: process.env.AI_PROVIDER || "ollama",
  AI_FALLBACK_PROVIDERS: process.env.AI_FALLBACK_PROVIDERS || "",
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "qwen3:8b",
  MONGO_URI: process.env.MONGO_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.1-70b-versatile",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY
};