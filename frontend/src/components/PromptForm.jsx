import { useState } from "react";

function PromptForm({ onSubmit, loading, darkMode }) {
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
    <form onSubmit={handleFormSubmit}>
      <div
        className={`rounded-3xl border transition-all duration-500 overflow-hidden hover:shadow-2xl ${
          darkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            darkMode
              ? "border-gray-800 bg-gray-950"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Describe Your Problem
          </h2>

          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Paste your bug, error, or coding question below.
          </p>
        </div>

        {/* Textarea */}
        <div className="p-6">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Why is my React component re-rendering infinitely?"
            disabled={loading}
            className={`w-full h-64 p-5 rounded-2xl resize-none border transition-all duration-200 focus:outline-none focus:ring-4 text-base leading-7 ${
              darkMode
                ? "bg-gray-950 border-gray-800 text-white placeholder-gray-500 focus:ring-blue-900"
                : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-100"
            }`}
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-5">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              AI-powered debugging assistant
            </p>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PromptForm;