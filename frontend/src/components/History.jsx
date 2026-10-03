import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, deleteHistoryItem } from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setError("Failed to load prompt history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prompt?")) return;

    try {
      await deleteHistoryItem(id);
      setHistory((items) => items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#111318]">
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">
            AI Developer Toolbox
          </Link>

          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4"
          >
            Back to workspace
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 mb-3">
            Workspace
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.03em]">
            Prompt history
          </h1>

          <p className="mt-3 text-gray-600">
            Previously submitted developer questions and responses.
          </p>
        </div>

        {loading && (
          <div className="border border-black/10 bg-white p-6 text-gray-500">
            Loading history...
          </div>
        )}

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="border border-black/10 bg-white p-10 text-center">
            <h2 className="font-semibold">No history yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your submitted prompts will appear here.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {history.map((item) => (
            <article
              key={item._id}
              className="border border-black/10 bg-white"
            >
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Prompt
                </p>

                <h2 className="mt-2 text-base font-semibold leading-6">
                  {item.question}
                </h2>

                <div className="mt-5 pt-5 border-t border-black/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Response
                  </p>

                  <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-gray-700">
                    {item.response}
                  </pre>
                </div>

                <div className="mt-5 pt-5 border-t border-black/10">
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default History;
