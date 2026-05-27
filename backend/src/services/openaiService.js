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
  console.log("NEW MOCK RESPONSE ACTIVE");
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
// jhjvg
// export const generateAIResponse = async () => {
//   return `
// THIS IS THE NEW MOCK RESPONSE

// IF YOU SEE THIS:
// BACKEND UPDATED SUCCESSFULLY.
// `;
// };