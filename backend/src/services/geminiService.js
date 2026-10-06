import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

export default class GeminiService {
  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.client = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });

    this.model = env.GEMINI_MODEL || "gemini-3.8-flash";
  }

  async generateAIResponse(prompt) {
    try {
      console.log(`Trying Gemini model: ${this.model}`);

      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
      });

      const text =
        response?.text ||
        response?.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || "")
          .join("")
          .trim();

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      console.log(`Successfully used Gemini model: ${this.model}`);

      return text.trim();
    } catch (error) {
      const message = error?.message || String(error);

      console.error(`Gemini request failed:`, message);

      throw new Error(`Gemini API failed: ${message}`);
    }
  }
}
