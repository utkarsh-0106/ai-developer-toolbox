import { useState } from "react";

function ResponseCard({ response, loading, error, darkMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getErrorClasses = () =>
    `rounded-4xl border p-8 ${darkMode ? "bg-red-950/50 border-red-800/50 backdrop-blur-xl" : "bg-red-50/80 border-red-200/50 backdrop-blur-xl"}`;

  const getEmptyStateClasses = () =>
    `rounded-4xl border p-10 transition-all flex flex-col h-full ${darkMode ? "bg-gray-900/80 border-gray-700/50 backdrop-blur-xl" : "bg-white/90 border-gray-200/50 backdrop-blur-xl shadow-indigo-500/5"}`;

  const getLoadingStateClasses = () =>
    `rounded-4xl border p-10 transition-all flex flex-col h-full ${darkMode ? "bg-gray-900/80 border-gray-700/50 backdrop-blur-xl" : "bg-white/90 border-gray-200/50 backdrop-blur-xl shadow-indigo-500/5"}`;

  const getCardClasses = () =>
    `rounded-4xl border overflow-hidden shadow-xl transition-all duration-500 ${darkMode ? "bg-gray-900/80 border-gray-700/50 backdrop-blur-xl" : "bg-white/90 border-gray-200/50 backdrop-blur-xl shadow-indigo-500/5"}`;

  const getHeaderClasses = () =>
    `flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-gray-800 bg-gray-950/50" : "border-gray-100 bg-gray-50/50"}`;

  const getBodyClasses = () =>
    `rounded-2xl p-6 border ${darkMode ? "bg-black/30 border-gray-800/50" : "bg-gray-50/50 border-gray-200/50"}`;

  const getIconBgClasses = () =>
    darkMode ? "bg-indigo-900/30" : "bg-indigo-50";

  const getIndicatorClasses = () =>
    darkMode ? "bg-red-900/50" : "bg-red-100";

  const getIndicatorTextClasses = () =>
    darkMode ? "text-red-300" : "text-red-700";

  const getIndicatorSubtextClasses = () =>
    darkMode ? "text-red-200/80" : "text-red-600";

  const getTitleClasses = () =>
    `text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`;

  const getSubtextClasses = () =>
    `text-base leading-7 ${darkMode ? "text-gray-400" : "text-gray-500"}`;

  const getHeadingClasses = () =>
    `text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`;

  const getSubHeadingClasses = () =>
    `text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`;

  const getCopyButtonClasses = () =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"}`;

  const getPreClasses = () =>
    `whitespace-pre-wrap font-mono leading-8 text-[14px] md:text-[15px] ${darkMode ? "text-gray-100" : "text-gray-800"}`;

  const getStatusBadgeClasses = () =>
    `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-indigo-900/50 text-indigo-200 border border-indigo-800" : "bg-indigo-50 text-indigo-700 border border-indigo-200"}`;

  const getEmptyIconBgClasses = () =>
    darkMode ? "bg-indigo-900/20" : "bg-indigo-50/50";

  // Error State
  if (error) {
    return (
      <div className={getErrorClasses()}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIndicatorClasses()}`}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className={`font-semibold ${getIndicatorTextClasses()}`}>
              Something went wrong
            </h3>
            <p className={`mt-1 text-sm ${getIndicatorSubtextClasses()}`}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!response && !loading) {
    return (
      <div className={getEmptyStateClasses()}>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${getEmptyIconBgClasses()}`}>
            <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <div className="mb-6 flex justify-center">
            <span className={getStatusBadgeClasses()}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Ready
            </span>
          </div>

          <h2 className={getTitleClasses()}>
            Ready to Analyze
          </h2>
          
          <p className={getSubtextClasses()}>
            Submit a coding question, error, or problem from the left panel.
            Your AI analysis will appear here with code snippets, explanations, and suggestions.
          </p>
          
          <div className="mt-8 pt-6 border-t w-full max-w-md mx-auto">
            <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              Supported tasks
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                { icon: "🐛", label: "Debug errors" },
                { icon: "📖", label: "Explain code" },
                { icon: "⚡", label: "Optimize queries" },
                { icon: "🔍", label: "Review APIs" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50/50"}`}>
                  <span className="text-base">{item.icon}</span>
                  <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading && !response) {
    return (
      <div className={getLoadingStateClasses()}>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
          <div className="text-center">
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Analyzing your problem...
            </h3>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              This usually takes a few seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getCardClasses()}>
      {/* Header */}
      <div className={getHeaderClasses()}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
            <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className={getHeadingClasses()}>
              AI Analysis
            </h2>
            <p className={getSubHeadingClasses()}>
              Generated developer assistance
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={getCopyButtonClasses()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Response Body */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        <div className={getBodyClasses()}>
          <pre className={getPreClasses()}>
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ResponseCard;