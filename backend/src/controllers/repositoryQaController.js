import AIService from "../services/aiService.js";
import { answerRepositoryQuestion } from "../services/repositoryQaService.js";

export const askRepositoryQuestion = async (req, res) => {
  try {
    const { repositoryId, question } = req.body || {};

    if (!repositoryId) {
      return res.status(400).json({
        message: "repositoryId is required",
      });
    }

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "question is required",
      });
    }

    if (question.trim().length > 5000) {
      return res.status(400).json({
        message: "question must be 5000 characters or fewer",
      });
    }

    const result = await answerRepositoryQuestion({
      userId: req.user._id,
      repositoryId,
      question: question.trim(),
      aiService: new AIService(),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Repository Q&A error:", error);

    const message = error?.message || "Failed to answer repository question";

    if (
      message === "Invalid repository ID" ||
      message === "repositoryId is required" ||
      message === "question is required"
    ) {
      return res.status(400).json({ message });
    }

    if (message === "Repository not found") {
      return res.status(404).json({ message });
    }

    if (message === "Repository is not ready for questions") {
      return res.status(409).json({ message });
    }

    if (message === "No relevant repository context found") {
      return res.status(422).json({ message });
    }

    return res.status(500).json({
      message: "Failed to answer repository question",
    });
  }
};
