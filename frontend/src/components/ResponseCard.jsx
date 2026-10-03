import { useState } from "react";

function ResponseCard({ response, darkMode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response) return;

    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <section
      className={`border ${
        darkMode
          ? "border-white/10 bg-[#111419]"
          : "border-black/10 bg-white"
      }`}
    >
      <div
        className={`px-6 py-5 border-b flex items-center justify-between gap-4 ${
          darkMode ? "border-white/10" : "border-black/10"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 ${
                response ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />

            <h2 className="text-lg font-semibold tracking-tight">
              AI response
            </h2>
          </div>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {response
              ? "Generated from your request"
              : "Your analysis will appear here"}
          </p>
        </div>

        {response && (
          <button
            type="button"
            onClick={handleCopy}
            className={`border px-3 py-2 text-sm font-medium transition-colors ${
              darkMode
                ? "border-white/10 text-gray-200 hover:bg-white/5"
                : "border-black/10 text-gray-700 hover:bg-black/[0.03]"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      <div className="p-6">
        <div
          className={`min-h-[430px] border p-6 overflow-auto ${
            darkMode
              ? "border-white/10 bg-[#0b0d10]"
              : "border-black/10 bg-[#fafafa]"
          }`}
        >
          {response ? (
            <pre
              className={`whitespace-pre-wrap break-words font-sans text-[15px] leading-7 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {response}
            </pre>
          ) : (
            <div className="min-h-[380px] flex items-center justify-center text-center">
              <div className="max-w-sm">
                <div
                  className={`mx-auto mb-5 w-10 h-10 border flex items-center justify-center ${
                    darkMode
                      ? "border-white/15 text-gray-500"
                      : "border-black/10 text-gray-400"
                  }`}
                >
                  &gt;_
                </div>

                <h3 className="text-base font-semibold">
                  Ready for your problem
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Submit a coding problem, error, or engineering question to
                  generate a structured response.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResponseCard;
