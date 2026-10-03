import { useState } from "react";
import { Link } from "react-router-dom";

import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";

import { getAIResponse } from "../services/api";

const QUICK_PROMPTS = [
  { label: "Debug React error", prompt: "Debug this React error: " },
  { label: "Explain this code", prompt: "Explain what this code does: " },
  { label: "Optimize SQL query", prompt: "Optimize this SQL query: " },
  { label: "Review my API", prompt: "Review this API design: " },
];

function Home() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (prompt) => {
    try {
      setLoading(true);
      setError("");
      setResponse("");

      console.log("Home received prompt:", prompt);

      const aiResponse = await getAIResponse(prompt);

      console.log("AI response received:", aiResponse);

      setResponse(aiResponse.response);
    } catch (error) {
      console.error("AI submit error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (template) => {
    setPrompt(template);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-950"
          : "bg-linear-to-br from-blue-100 via-indigo-100 to-violet-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                  darkMode
                    ? "bg-indigo-900/50 text-indigo-200 border border-indigo-800"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                AI-POWERED DEVELOPER ASSISTANT
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/history"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                }`}
              >
                View History
              </Link>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 shadow-sm"
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                AI Developer Toolbox
              </span>
            </h1>
            <p className={`mt-4 text-lg md:text-xl ${darkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed`}>
              Debug smarter. Build faster. An AI workspace designed for developers who demand precision.
            </p>
          </div>
        </header>

        {/* Main Workspace */}
        <main>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Input Panel */}
            <div className="lg:pr-2">
              <PromptForm
                onSubmit={handleSubmit}
                loading={loading}
                darkMode={darkMode}
                prompt={prompt}
                setPrompt={setPrompt}
                quickPrompts={QUICK_PROMPTS}
                onQuickPrompt={handleQuickPrompt}
              />
            </div>

            {/* Response Panel */}
            <div className="lg:pl-2">
              <ResponseCard
                response={response}
                loading={loading}
                error={error}
                darkMode={darkMode}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;