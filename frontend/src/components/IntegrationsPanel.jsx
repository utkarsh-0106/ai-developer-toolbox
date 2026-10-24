import { useCallback, useEffect, useMemo, useState } from "react";
import {
  startGitHubConnection,
  getGitHubConnection,
  getConnectedGitHubRepositories,
  disconnectGitHub,
  indexConnectedGitHubRepository,
} from "../services/api";
import "./integrations-panel.css";

export default function IntegrationsPanel() {
  const token = typeof localStorage !== "undefined"
    ? localStorage.getItem("auth_token")
    : null;

  const [github, setGithub] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [indexingRepo, setIndexingRepo] = useState("");

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const g = await getGitHubConnection();
      setGithub(g);
    } catch (e) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    getGitHubConnection()
      .then((g) => {
        if (cancelled) return;
        setGithub(g);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredRepos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return repos.filter((repo) => {
      const matchesSearch = !query
        || repo.fullName?.toLowerCase().includes(query)
        || repo.description?.toLowerCase().includes(query)
        || repo.language?.toLowerCase().includes(query);

      const matchesVisibility = visibility === "all"
        || (visibility === "private" && repo.private)
        || (visibility === "public" && !repo.private);

      return matchesSearch && matchesVisibility;
    });
  }, [repos, search, visibility]);

  const privateCount = repos.filter((repo) => repo.private).length;
  const publicCount = repos.length - privateCount;

  const run = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const browseRepositories = () => run(async () => {
    setLoadingRepos(true);
    try {
      const result = await getConnectedGitHubRepositories();
      setRepos(Array.isArray(result.repositories) ? result.repositories : []);
      setNotice("");
    } finally {
      setLoadingRepos(false);
    }
  });

  const indexRepository = (repo) => run(async () => {
    setIndexingRepo(repo.fullName);
    setNotice("");
    try {
      const result = await indexConnectedGitHubRepository(repo.url);
      setNotice(`Indexed ${result.repository.fullName} · ${result.chunkCount} chunks`);
      window.dispatchEvent(new CustomEvent("adt:repository-indexed", {
        detail: result,
      }));
    } finally {
      setIndexingRepo("");
    }
  });

  if (!token) {
    return (
      <section className="adt-integrations adt-integrations-locked">
        <div className="adt-integrations-orb" aria-hidden="true">✦</div>
        <span className="adt-integrations-eyebrow">Developer connections</span>
        <h2>Connect your developer accounts</h2>
        <p>Sign in to connect GitHub and manage your repositories.</p>
      </section>
    );
  }

  return (
    <section className="adt-integrations">
      <header className="adt-integrations-heading">
        <div>
          <span className="adt-integrations-eyebrow">JARVIS · integrations hub</span>
          <h2>Connected systems<span className="adt-heading-period">.</span></h2>
          <p>Bring your codebase and assistant tools into one workspace.</p>
        </div>
        <div className="adt-integrations-live">
          <span className="adt-integrations-live-dot" />
          {github?.connected ? "GitHub connected" : "Awaiting connection"}
        </div>
      </header>

      <div className="adt-integration-grid">
        <article className="adt-integration-card adt-github-card">
          <div className="adt-integration-card-top">
            <div className="adt-integration-icon adt-github-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8.5 19.2c-4.4 1.3-4.4-2.2-6.2-2.6m12.4 5v-3.4a3 3 0 0 0-.8-2.3c4.1-.5 8.4-2 8.4-9A7 7 0 0 0 20.4 2a6.5 6.5 0 0 0-.2-4.8S18.6-3.3 14.7 0a17 17 0 0 0-9.4 0C1.4-3.3-.2-2.8-.2-2.8A6.5 6.5 0 0 0-.4 2a7 7 0 0 0-1.9 4.9c0 7 4.3 8.5 8.4 9a3 3 0 0 0-.8 2.3v3.4" transform="translate(2 2)" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={`adt-integration-status ${github?.connected ? "is-connected" : ""}`}>
              <span />{github?.connected ? "Connected" : "Not connected"}
            </span>
          </div>

          <div className="adt-integration-title-row">
            <div>
              <h3>GitHub</h3>
              <p className="adt-integration-subtitle">Repository intelligence</p>
            </div>
          </div>

          <div className="adt-account-strip">
            <div className="adt-account-avatar">
              {github?.account?.login?.slice(0, 1)?.toUpperCase() || "G"}
            </div>
            <div className="adt-account-copy">
              <span className="adt-account-label">Connected account</span>
              <strong>{github?.connected ? `@${github.account.login}` : "Your GitHub account"}</strong>
            </div>
            {github?.connected && <span className="adt-account-check">✓</span>}
          </div>

          <div className="adt-integration-actions">
            {github?.connected ? (
              <>
                <button className="adt-integration-primary" disabled={busy} onClick={browseRepositories}>
                  {loadingRepos ? <span className="adt-button-spinner" /> : <span>⌕</span>}
                  {loadingRepos ? "Loading repositories…" : "Browse repositories"}
                </button>
                <button
                  className="adt-integration-quiet"
                  disabled={busy}
                  onClick={() => run(async () => {
                    await disconnectGitHub();
                    setRepos([]);
                    setSearch("");
                    await refresh();
                  })}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="adt-integration-primary"
                disabled={busy}
                onClick={() => run(async () => {
                  const { url } = await startGitHubConnection();
                  window.location.assign(url);
                })}
              >
                Connect GitHub <span>↗</span>
              </button>
            )}
          </div>

          {repos.length > 0 && (
            <div className="adt-repository-explorer">
              <div className="adt-repository-heading">
                <div>
                  <span className="adt-integrations-eyebrow">Your workspace</span>
                  <h4>Repositories <span>{repos.length}</span></h4>
                </div>
                <button className="adt-refresh-button" disabled={busy} onClick={browseRepositories} title="Refresh repositories" aria-label="Refresh repositories">↻</button>
              </div>

              <div className="adt-repository-stats">
                <span><i className="adt-stat-dot is-public" />{publicCount} public</span>
                <span><i className="adt-stat-dot is-private" />{privateCount} private</span>
              </div>

              <label className="adt-repository-search">
                <span aria-hidden="true">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search repositories…"
                  aria-label="Search repositories"
                />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
              </label>

              <div className="adt-repository-filters" role="group" aria-label="Repository visibility">
                {[
                  ["all", "All", repos.length],
                  ["public", "Public", publicCount],
                  ["private", "Private", privateCount],
                ].map(([value, label, count]) => (
                  <button
                    key={value}
                    className={visibility === value ? "active" : ""}
                    onClick={() => setVisibility(value)}
                    aria-pressed={visibility === value}
                  >
                    {label}<span>{count}</span>
                  </button>
                ))}
              </div>

              <div className="adt-repository-list">
                {filteredRepos.map((repo) => (
                  <div className="adt-repository-row" key={repo.id}>
                    <div className={`adt-repository-visibility ${repo.private ? "is-private" : "is-public"}`} aria-label={repo.private ? "Private repository" : "Public repository"}>
                      {repo.private ? "▣" : "◉"}
                    </div>
                    <div className="adt-repository-details">
                      <a href={repo.url} target="_blank" rel="noreferrer" title={repo.fullName}>
                        {repo.fullName}
                        <span className="adt-external-link">↗</span>
                      </a>
                      <div className="adt-repository-meta">
                        <span>{repo.private ? "Private" : "Public"}</span>
                        {repo.language && <><i /> <span>{repo.language}</span></>}
                      </div>
                    </div>
                    <button
                      className="adt-repository-index"
                      disabled={busy}
                      onClick={() => indexRepository(repo)}
                      title={`Index ${repo.fullName}`}
                    >
                      {indexingRepo === repo.fullName ? <span className="adt-button-spinner" /> : "Index"}
                    </button>
                  </div>
                ))}
                {filteredRepos.length === 0 && (
                  <div className="adt-repository-empty">
                    <span>⌕</span>
                    <strong>No matching repositories</strong>
                    <p>Try a different name or visibility filter.</p>
                    <button onClick={() => { setSearch(""); setVisibility("all"); }}>Clear filters</button>
                  </div>
                )}
              </div>
              <p className="adt-repository-footnote">Showing {filteredRepos.length} of {repos.length} repositories</p>
            </div>
          )}

          {repos.length === 0 && github?.connected && (
            <div className="adt-github-empty">
              <span className="adt-empty-glyph">⌘</span>
              <strong>Your codebase, connected.</strong>
              <p>Browse your repositories to search, explore, and index code for AI-powered Q&amp;A.</p>
            </div>
          )}
        </article>

      </div>

      {notice && <div className="adt-integrations-message is-success" role="status"><span>✓</span>{notice}</div>}
      {error && <div className="adt-integrations-message is-error" role="alert"><span>!</span>{error}</div>}
    </section>
  );
}
