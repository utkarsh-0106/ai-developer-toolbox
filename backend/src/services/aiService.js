import { env } from "../config/env.js";
import GeminiService from "./geminiService.js";
import GroqService from "./groqService.js";
import { generateAIResponse } from "./openaiService.js";

export default class AIService {
  constructor() {
    this.providers = [];

    if (env.GEMINI_API_KEY) {
      this.providers.push({
        name: "Gemini",
        generate: (prompt) => new GeminiService().generateAIResponse(prompt),
      });
    }

    if (env.GROQ_API_KEY) {
      this.providers.push({
        name: "Groq",
        generate: (prompt) => new GroqService().generateAIResponse(prompt),
      });
    }

    if (env.OPENAI_API_KEY) {
      this.providers.push({
        name: "OpenAI",
        generate: generateAIResponse,
      });
    }
  }

  async generateResponse(prompt) {
    for (const provider of this.providers) {
      try {
        console.log(`Trying ${provider.name} provider...`);

        const response = await provider.generate(prompt);

        if (typeof response === "string" && response.trim()) {
          console.log(`Successfully used ${provider.name} provider`);
          return response;
        }

        throw new Error(`${provider.name} returned an empty response`);
      } catch (error) {
        console.error(
          `${provider.name} provider failed:`,
          error?.message || error
        );
      }
    }

    console.log("All configured AI providers failed. Using mock fallback.");
    return getMockResponse(prompt);
  }
}

const getMockResponse = (prompt) => {
  console.log("MOCK AI RESPONSE ACTIVE");

  return `
## Problem Analysis

It looks like your issue may be related to:

"${prompt}"

--------------------------------------------------

## Possible Causes

1. Infinite React render cycles
2. Incorrect useEffect dependencies
3. State updates triggering re-renders
4. Improper API handling
5. Async logic issues

--------------------------------------------------

## Suggested Debugging Steps

### Step 1 — Inspect Console Errors

Carefully read browser console warnings and stack traces.

### Step 2 — Verify State Updates

Ensure state setters are not executing repeatedly.

### Step 3 — Inspect useEffect

Check dependency arrays carefully to avoid loops.

### Step 4 — Add Logs

Use console.log strategically to trace execution flow.

### Step 5 — Isolate Components

Simplify the component temporarily to locate the root issue.

--------------------------------------------------

## Engineering Advice

Strong engineers debug systematically:
- isolate variables
- test assumptions
- simplify complexity
- validate one layer at a time

Avoid random guessing while debugging complex applications.
`;
};
