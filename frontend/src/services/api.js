const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/api/ai/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return response.json();
};

export const getAIResponse = async (prompt) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return response.json();
};

export const deleteHistoryItem = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/api/ai/history/${id}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
};