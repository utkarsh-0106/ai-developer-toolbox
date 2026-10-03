import { useEffect, useState } from "react";
import {
  getHistory,
  deleteHistoryItem,
} from "../services/api";

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
    const confirmed = window.confirm(
      "Delete this prompt?"
    );

    if (!confirmed) return;

    try {
      await deleteHistoryItem(id);

      setHistory((prevHistory) =>
        prevHistory.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return <p>Loading history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="history-container">
      <h2>Prompt History</h2>

      {history.length === 0 ? (
        <p>No prompt history found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item._id}
            className="history-card"
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h4>{item.question}</h4>

            <p>{item.response}</p>

            <button
              onClick={() => handleDelete(item._id)}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;