const API_BASE_URL = "http://localhost:5000";

export const generateAIResponse = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data.response;
  } catch (error) {
    console.error("API Error:", error);

    throw error;
  }
};