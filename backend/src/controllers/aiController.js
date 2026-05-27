import { generateAIResponse } from "../services/openaiService.js";

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

// ljkhgfxdgchvbj
// export const generateResponse = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     console.log("Prompt received:", prompt);

//     return res.status(200).json({
//       response: `Mock AI response for: ${prompt}`,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };