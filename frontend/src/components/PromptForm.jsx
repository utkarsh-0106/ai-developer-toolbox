import { useState } from "react";

function PromptForm({ onSubmit, loading, darkMode }) {
  const [prompt, setPrompt] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!prompt.trim() || loading) {
      return;
    }

    onSubmit(prompt.trim());
    setPrompt("");
  };

  const setQuickPrompt = (value) => {
    setPrompt(value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div
        className={`border ${
          darkMode
            ? "border-white/10 bg-[#111419]"
            : "border-black/10 bg-white"
        }`}
      >
        <div
          className={`px-6 py-5 border-b ${
            darkMode ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Your problem
              </h2>

              <p
                className={`mt-1 text-sm ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Describe an error, paste code, or ask an engineering question.
              </p>
            </div>

            <span
              className={`text-xs tabular-nums ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {prompt.length} / 5000
            </span>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Why is my React component re-rendering infinitely?"
            disabled={loading}
            maxLength={5000}
            className={`w-full min-h-[300px] resize-y border px-4 py-4 text-[15px] leading-7 outline-none transition-colors ${
              darkMode
                ? "border-white/10 bg-[#0b0d10] text-gray-100 placeholder:text-gray-600 focus:border-white/30"
                : "border-black/10 bg-[#fafafa] text-gray-900 placeholder:text-gray-400 focus:border-black/30"
            }`}
          />

          <div className="mt-5">
            <p
              className={`text-xs font-medium uppercase tracking-wider mb-3 ${
                darkMode ? "text-gray-600" : "text-gray-500"
              }`}
            >
              Quick prompts
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Debug React error",
                "Explain this code",
                "Optimize SQL query",
                "Review my API",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuickPrompt(item)}
                  className={`border px-3 py-2 text-sm transition-colors ${
                    darkMode
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-black/10 text-gray-700 hover:bg-black/[0.03]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`mt-6 pt-5 border-t flex items-center justify-between gap-4 ${
              darkMode ? "border-white/10" : "border-black/10"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Structured developer assistance
            </p>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`border px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                darkMode
                  ? "border-white bg-white text-black hover:bg-gray-200"
                  : "border-[#111318] bg-[#111318] text-white hover:bg-black"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PromptForm;
