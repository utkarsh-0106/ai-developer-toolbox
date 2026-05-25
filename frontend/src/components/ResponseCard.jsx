import { useState } from "react";

function ResponseCard({ response }) {
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

  // Empty state
  if (!response) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Ready to Help
        </h2>

        <p className="text-gray-500">
          Ask your coding question and the AI response will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          AI Response
        </h2>

        <button
          onClick={handleCopy}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-gray-700 font-sans">
          {response}
        </pre>
      </div>
    </div>
  );
}

export default ResponseCard;