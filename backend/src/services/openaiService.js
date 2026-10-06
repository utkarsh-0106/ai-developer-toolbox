import OpenAI from "openai";
import { env } from "../config/env.js";

let openai = null;

if (env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

export const generateAIResponse = async (prompt) => {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI software engineering assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
    });

    const response = completion?.choices?.[0]?.message?.content;

    if (!response?.trim()) {
      throw new Error("OpenAI returned an empty response");
    }

    return response;
  } catch (error) {
    console.error(
      "OpenAI Service Error:",
      error?.status || "",
      error?.message || error
    );

    // IMPORTANT:
    // Do not return the mock here.
    // Throw so AIService can try the next provider.
    throw error;
  }
};
