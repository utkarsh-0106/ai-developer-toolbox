import { useState } from "react";

function PromptForm({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    onSubmit(prompt);

    setPrompt("");
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-6 rounded-xl shadow-md"
    >
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Describe your bug or coding problem..."
        disabled={loading}
        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>
    </form>
  );
}

export default PromptForm;