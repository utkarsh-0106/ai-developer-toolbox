const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000");

console.log("AI Toolbox API:", API_BASE_URL);

const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.error || `API request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const getAIResponse = async (prompt) => {
  console.log("Sending AI request:", prompt);

  return request(`${API_BASE_URL}/api/ai/ask`, {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
};

export const getHistory = async () => {
  console.log("Fetching history...");

  return request(`${API_BASE_URL}/api/ai/history`);
};

export const deleteHistoryItem = async (id) => {
  return request(`${API_BASE_URL}/api/ai/history/${id}`, {
    method: "DELETE",
  });
};
