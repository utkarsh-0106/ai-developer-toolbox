import OpenAI from "openai";
import { env } from "../config/env.js";

let openai = null;

// Initialize OpenAI only if API key exists
if (env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

export const generateAIResponse = async (prompt) => {
  try {
    // If OpenAI is not configured, return mock response
    if (!openai) {
      return getMockResponse(prompt);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI software engineering assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "OpenAI Service Error:",
      error.response?.data || error.message || error
    );

    // Fallback to mock response if API fails
    return getMockResponse(prompt);
  }
};

// Mock AI responses
const getMockResponse = (prompt) => {
  return `
Mock AI Response:

You asked:
"${prompt}"

Suggested debugging steps:

1. Check console errors carefully
2. Verify variable names
3. Inspect API responses
4. Use console.log strategically
5. Test smaller isolated parts

Engineering Tip:
Always debug systematically instead of guessing.
`;
};