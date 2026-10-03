// groqService.js

import Groq from "groq-sdk";
import { env } from "../config/env.js";

export default class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: env.GROQ_API_KEY,
    });
  }

  async generateContent(prompt) {
    try {
      const response = await this.groq.chat.completions.create({
        model: env.GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Groq service error:', error);
      throw error;
    }
  }
}