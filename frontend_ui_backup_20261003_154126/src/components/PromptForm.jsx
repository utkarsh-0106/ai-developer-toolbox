import { useState } from "react";

function PromptForm({
  onSubmit,
  loading,
  darkMode,
  prompt,
  setPrompt,
  quickPrompts,
  onQuickPrompt,
}) {
  const [characterCount, setCharacterCount] = useState(0);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    onSubmit(prompt);

    setPrompt("");
    setCharacterCount(0);
  };

  const handleTextareaChange = (event) => {
    const value = event.target.value;
    setPrompt(value);
    setCharacterCount(value.length);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div
        className={`rounded-4xl border shadow-xl transition-all duration-500 overflow-hidden ${
          darkMode
            ? "bg-gray-900/80 border-gray-700/50 backdrop-blur-xl"
            : "bg-white/90 border-gray-200/50 backdrop-blur-xl shadow-indigo-500/5"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b ${
            darkMode
              ? "border-gray-800 bg-gray-950/50"
              : "border-gray-100 bg-gray-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Problem
              </h2>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Describe the issue, paste an error, or ask a coding question
              </p>
            </div>
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {characterCount} / 5000
            </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="p-6">
          <textarea
            value={prompt}
            onChange={handleTextareaChange}
            placeholder="Example: Why is my React component re-rendering infinitely?"
            disabled={loading}
            maxLength={5000}
            className={`w-full h-72 p-5 rounded-2xl resize-none border transition-all duration-200 focus:outline-none focus:ring-4 text-base leading-7 ${
              darkMode
                ? "bg-gray-950 border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-900/50"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-100"
            }`}
          />

          {/* Quick Prompts */}
          <div className="mt-5">
            <p className={`text-xs font-medium mb-3 ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
              Quick prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onQuickPrompt(item.prompt)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
                  } disabled:opacity-50`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              AI-powered debugging assistant
            </p>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-8 py-4 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Thinking...
                </span>
              ) : (
                "Ask AI"
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PromptForm;