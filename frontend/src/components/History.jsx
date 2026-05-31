import { useEffect, useState } from "react";
import { getHistory } from "../services/api";

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
          <div key={item._id || item.id} className="history-card">
            <h4>{item.question}</h4>
            <p>{item.response}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;