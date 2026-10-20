import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, deleteHistoryItem } from "../services/api";
import "./history.css";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        if (active) setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        if (active) setError("Failed to load prompt history. Please try again in a moment.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchHistory();
    return () => { active = false; };
  }, []);

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return history;
    return history.filter((item) => `${item.question || ""} ${item.response || ""}`.toLowerCase().includes(term));
  }, [history, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prompt?")) return;
    try {
      await deleteHistoryItem(id);
      setHistory((items) => items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete this entry. Please try again.");
    }
  };

  return (
    <div className="history-page">
      <div className="history-ambient" aria-hidden="true" />
      <header className="history-header">
        <div className="history-header-inner">
          <Link to="/" className="history-brand"><span className="history-brand-mark">✦</span><span>AI DEVELOPER TOOLBOX</span></Link>
          <div className="history-header-right"><span className="history-status"><i /> WORKSPACE</span><Link to="/" className="history-back">← <span>Back to workspace</span></Link></div>
        </div>
      </header>

      <main className="history-main">
        <section className="history-intro">
          <div className="history-eyebrow"><span /> YOUR ACTIVITY</div>
          <h1 data-guide="history-title">Prompt <em>history</em></h1>
          <p>Revisit previous questions and AI responses, pick up where you left off, and keep your engineering work organized.</p>
          <div className="history-stats" aria-label="History summary">
            <div className="history-stat"><span className="history-stat-icon">↻</span><div><strong>{history.length}</strong><small>Total entries</small></div></div>
            <div className="history-stat"><span className="history-stat-icon">⌕</span><div><strong>{filteredHistory.length}</strong><small>{search ? "Matching entries" : "Visible entries"}</small></div></div>
            <div className="history-stat"><span className="history-stat-icon">✧</span><div><strong>AI</strong><small>Workspace archive</small></div></div>
          </div>
        </section>

        <section className="history-content" aria-label="Saved prompts">
          <div className="history-toolbar">
            <label className="history-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search prompts and responses..." aria-label="Search prompt history" /></label>
            <span className="history-count">{filteredHistory.length} {filteredHistory.length === 1 ? "ENTRY" : "ENTRIES"}</span>
          </div>

          {loading && <div className="history-state"><span className="history-loader" /><h2>Loading your history</h2><p>Retrieving saved prompts and responses…</p></div>}
          {error && <div className="history-error" role="alert"><strong>Something went wrong</strong><p>{error}</p><button type="button" onClick={() => window.location.reload()}>Reload history</button></div>}
          {!loading && !error && filteredHistory.length === 0 && (
            <div className="history-state history-empty"><span className="history-empty-icon">⌁</span><h2>{search ? "No matching entries" : "Your history starts here"}</h2><p>{search ? "Try a different keyword to find a saved prompt." : "Questions you submit in the AI Workspace will appear here, ready to revisit whenever you need them."}</p>{search && <button type="button" onClick={() => setSearch("")}>Clear search</button>}{!search && <Link to="/" className="history-primary-link">Go to AI Workspace <span>→</span></Link>}</div>
          )}

          <div className="history-list">
            {filteredHistory.map((item, index) => {
              const isExpanded = Boolean(expanded[item._id]);
              return (
                <article className="history-card" key={item._id}>
                  <div className="history-card-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                  <div className="history-card-body">
                    <div className="history-card-meta"><span>AI WORKSPACE</span><span className="history-dot" /> <span>SESSION {String(index + 1).padStart(2, "0")}</span></div>
                    <h2>{item.question || "Untitled prompt"}</h2>
                    <div className={`history-response${isExpanded ? " is-expanded" : ""}`}><p className="history-response-label">AI RESPONSE</p><pre>{item.response || "No response was saved for this entry."}</pre></div>
                    <div className="history-card-actions"><button type="button" className="history-expand" onClick={() => setExpanded((current) => ({ ...current, [item._id]: !current[item._id] }))}>{isExpanded ? "Collapse response" : "View full response"} <span>{isExpanded ? "↑" : "↓"}</span></button><button type="button" className="history-delete" onClick={() => handleDelete(item._id)} aria-label={`Delete prompt: ${item.question || "Untitled prompt"}`}>⌫ <span>Delete</span></button></div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <footer className="history-footer"><span><i /> AI SYSTEMS ONLINE</span><span>AI DEVELOPER TOOLBOX <b>·</b> HISTORY</span></footer>
      </main>
    </div>
  );
}

export default History;
