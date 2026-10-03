import { useState } from "react";
import { Link } from "react-router-dom";
import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";
import { getAIResponse } from "../services/api";

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

      const aiResponse = await getAIResponse(prompt);
      setResponse(aiResponse.response);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#0b0d10] text-white" : "bg-[#f6f7f9] text-[#111318]"
      }`}
    >
      <header
        className={`border-b ${
          darkMode
            ? "border-white/10 bg-[#0b0d10]"
            : "border-black/10 bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight"
          >
            AI Developer Toolbox
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link
              to="/history"
              className={`hover:underline underline-offset-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              History
            </Link>

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className={`border px-3 py-2 text-sm font-medium transition-colors ${
                darkMode
                  ? "border-white/15 text-gray-200 hover:bg-white/5"
                  : "border-black/10 text-gray-700 hover:bg-black/[0.03]"
              }`}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <section className="max-w-3xl mb-12">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] mb-4 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Developer productivity
          </p>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.05] ${
              darkMode ? "text-white" : "text-[#111318]"
            }`}
          >
            Debug, explain, and review software problems.
          </h1>

          <p
            className={`mt-5 max-w-2xl text-base md:text-lg leading-7 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            A focused workspace for developers. Submit an error, coding
            question, API problem, or engineering issue and get a structured
            technical response.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 items-start">
          <PromptForm
            onSubmit={handleSubmit}
            loading={loading}
            darkMode={darkMode}
          />

          <ResponseCard
            response={response}
            darkMode={darkMode}
          />
        </section>

        {error && (
          <div
            className={`mt-6 border px-4 py-3 text-sm ${
              darkMode
                ? "border-red-400/30 bg-red-400/5 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <footer
          className={`mt-16 pt-6 border-t flex flex-col sm:flex-row justify-between gap-4 text-sm ${
            darkMode
              ? "border-white/10 text-gray-500"
              : "border-black/10 text-gray-500"
          }`}
        >
          <p>AI Developer Toolbox</p>

          <div className="flex gap-5">
            <Link
              to="/privacy"
              className="hover:text-current hover:underline underline-offset-4"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="hover:text-current hover:underline underline-offset-4"
            >
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;
