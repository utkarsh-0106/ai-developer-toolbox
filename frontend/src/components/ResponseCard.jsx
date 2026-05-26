import { useState } from "react";

function ResponseCard({ response, darkMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Empty State
  if (!response) {
    return (
      <div
        className={`rounded-3xl border p-12 text-center transition-all ${
          darkMode
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="text-5xl mb-5">🤖</div>

        <h2
          className={`text-2xl font-bold mb-3 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Ready to Help
        </h2>

        <p
          className={`max-w-lg mx-auto leading-7 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Ask your coding question, debugging issue, or software engineering
          problem and your AI response will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        darkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-6 py-5 border-b ${
          darkMode
            ? "border-gray-800 bg-gray-950"
            : "border-gray-100 bg-gray-50"
        }`}
      >
        <div>
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            AI Response
          </h2>

          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Generated developer assistance
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Response Body */}
      <div className="p-6 md:p-8">
        <div
          className={`rounded-2xl p-6 border ${
            darkMode
              ? "bg-gray-950 border-gray-800"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <pre
            className={`whitespace-pre-wrap font-sans leading-8 text-[15px] ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ResponseCard;