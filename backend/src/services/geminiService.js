import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const MODELS = [
  env.GEMINI_MODEL || "gemini-3.8-flash",
  "gemini-3.7-flash",
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = error?.status || error?.error?.code;

  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

const generateWithRetry = async (model, prompt) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Gemini ${model} attempt ${attempt}/${maxAttempts}`
      );

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = response?.text?.trim();

      if (!text) {
        throw new Error(`${model} returned an empty response`);
      }

      return text;
    } catch (error) {
      console.error(
        `Gemini ${model} attempt ${attempt} failed:`,
        error?.message || error
      );

      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }

      const delay = 1000 * 2 ** (attempt - 1);

      console.log(
        `Retrying ${model} in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw new Error(`${model} failed after retries`);
};

export default class GeminiService {
  async generateAIResponse(prompt) {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    let lastError = null;

    for (const model of [...new Set(MODELS)]) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await generateWithRetry(
          model,
          prompt
        );

        console.log(
          `Successfully used Gemini model: ${model}`
        );

        return response;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini model ${model} failed completely:`,
          error?.message || error
        );
      }
    }

    throw lastError || new Error("All Gemini models failed");
  }
}
