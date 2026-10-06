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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/10">
              {[
                ["01", "Debug React error"],
                ["02", "Explain this code"],
                ["03", "Optimize SQL query"],
                ["04", "Review my API"],
              ].map(([number, item]) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuickPrompt(item)}
                  className={`group relative flex items-center justify-between overflow-hidden px-3.5 py-3 text-left text-xs font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-[#0b0d10] text-gray-300 hover:bg-white/[0.07] hover:text-white"
                      : "bg-white text-gray-700 hover:bg-[#f4f5f6] hover:text-black"
                  }`}
                >
                  <span
                    className={`relative z-10 mr-4 text-[9px] font-semibold tracking-[0.18em] transition-colors ${
                      darkMode
                        ? "text-white/25 group-hover:text-white/60"
                        : "text-black/25 group-hover:text-black/60"
                    }`}
                  >
                    {number}
                  </span>

                  <span className="relative z-10 flex-1">
                    {item}
                  </span>

                  <span
                    className={`relative z-10 ml-3 text-sm transition-transform duration-300 group-hover:translate-x-0.5 ${
                      darkMode ? "text-white/25" : "text-black/25"
                    }`}
                  >
                    ↗
                  </span>

                  <span
                    className={`absolute inset-y-0 left-0 w-px origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100 ${
                      darkMode ? "bg-white/70" : "bg-black/70"
                    }`}
                  />
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
