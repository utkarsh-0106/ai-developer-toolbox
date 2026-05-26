import { useState } from "react";

import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";

import { generateAIResponse } from "../services/api";

function Home() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (prompt) => {
    try {
      setLoading(true);
      setError("");
      setResponse("");

      const aiResponse = await generateAIResponse(prompt);

      setResponse(aiResponse);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-950"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-100"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1
              className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    AI Developer Toolbox
                </span>
            </h1>

            <p
              className={`mt-3 text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Debug smarter. Learn faster. Build better.
            </p>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`px-5 py-3 rounded-xl font-medium transition-all shadow-sm ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800"
            }`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Main Card */}
        <div
          className={`rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border backdrop-blur-xl transition-all duration-500 ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white/80 border-white"
          }`}
        >
          <PromptForm
            onSubmit={handleSubmit}
            loading={loading}
            darkMode={darkMode}
          />

          <div className="mt-8">
            {error && (
              <div
                className={`border p-4 rounded-2xl mb-6 ${
                  darkMode
                    ? "bg-red-950 border-red-800 text-red-300"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {error}
              </div>
            )}

            <ResponseCard
              response={response}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;