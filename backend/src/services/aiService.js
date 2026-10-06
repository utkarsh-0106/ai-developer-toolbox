import { env } from "../config/env.js";

import GeminiService from "./geminiService.js";
import GroqService from "./groqService.js";
import OllamaService from "./ollamaService.js";
import { generateAIResponse } from "./openaiService.js";

function normalizeProvider(value) {
  return String(value || "").trim().toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export default class AIService {
  constructor() {
    this.providerFactories = {
      ollama: {
        enabled: true,
        generate: (prompt) => new OllamaService().generateAIResponse(prompt),
      },

      gemini: {
        enabled: Boolean(env.GEMINI_API_KEY),
        generate: (prompt) =>
          new GeminiService().generateAIResponse(prompt),
      },

      groq: {
        enabled: Boolean(env.GROQ_API_KEY),
        generate: (prompt) =>
          new GroqService().generateAIResponse(prompt),
      },

      openai: {
        enabled: Boolean(env.OPENAI_API_KEY),
        generate: (prompt) => generateAIResponse(prompt),
      },
    };

    const primary = normalizeProvider(env.AI_PROVIDER);

    const fallbackProviders = String(env.AI_FALLBACK_PROVIDERS || "")
      .split(",")
      .map(normalizeProvider);

    this.providerOrder = unique([
      primary,
      ...fallbackProviders,
    ]).filter((name) => this.providerFactories[name]);

    if (this.providerOrder.length === 0) {
      throw new Error(
        "No valid AI provider configured. Set AI_PROVIDER to ollama, gemini, groq, or openai."
      );
    }
  }

  async generateResponse(prompt) {
    const failures = [];

    for (const providerName of this.providerOrder) {
      const provider = this.providerFactories[providerName];

      if (!provider?.enabled) {
        console.log(
          `Skipping ${providerName}: provider is not configured`
        );
        continue;
      }

      try {
        console.log(`Trying ${providerName} provider...`);

        const response = await provider.generate(prompt);

        if (typeof response !== "string" || !response.trim()) {
          throw new Error("Provider returned an empty response");
        }

        console.log(`Successfully used ${providerName} provider`);

        return response.trim();
      } catch (error) {
        const message = error?.message || String(error);

        console.error(`${providerName} provider failed:`, message);

        failures.push(`${providerName}: ${message}`);
      }
    }

    throw new Error(
      `All configured AI providers failed. ${failures.join(" | ")}`
    );
  }
}
