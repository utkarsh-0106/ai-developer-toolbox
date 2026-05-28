const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateAIResponse(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();

    return data.response;
  } catch (error) {
    console.error("Fetch Error:", error);

    return `
## Mock AI Response

You asked:

"${prompt}"

--------------------------------------------------

## Suggested Debugging Steps

1. Check console errors carefully
2. Verify variable names
3. Inspect API responses
4. Use console.log strategically
5. Test isolated components

--------------------------------------------------

## Engineering Tip

Strong engineers debug systematically instead of guessing.
`;
  }
}