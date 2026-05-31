import { generateAIResponse } from "../services/openaiService.js";
import Prompt from "../models/Prompt.js";

export const generateResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const aiResponse = await generateAIResponse(prompt);

    // Save prompt and response to MongoDB
    await Prompt.create({
      question: prompt,
      response: aiResponse,
    });

    res.status(200).json({
      response: aiResponse,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      error: "Failed to generate AI response",
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await Prompt.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve history",
    });
  }
};

export const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    await Prompt.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "History item deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete history item",
    });
  }
};