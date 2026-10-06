import ReadableAIResponse from "../components/ReadableAIResponse";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import PromptForm from "../components/PromptForm";
import ResponseCard from "../components/ResponseCard";
import {
  getAIResponse, getGitHubRepositoryMetadata, indexGitHubRepository, askRepositoryQuestion,
  getRepositoryTree, getRepositoryFile, analyzeRepository, runRepositoryAgent, runCodeReview,
  runDebugging, runSecurityScan, generateTests, reviewDiff, searchRepository, getRagTelemetry,
  evaluateRetrieval,
} from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Icon = ({ name, size = 18 }) => {
  const paths = {
    home: <><path d="m3 9 6-6 6 6"/><path d="M5 8v8h8V8"/><path d="M8 16v-5h2v5"/></>,
    github: <path d="M9 2.5a6.5 6.5 0 0 0-2.05 12.67c.33.06.45-.14.45-.32v-1.13c-1.83.4-2.22-.78-2.22-.78-.3-.77-.74-.97-.74-.97-.6-.41.05-.4.05-.4.66.05 1 .68 1 .68.59 1 1.55.71 1.93.54.06-.42.23-.71.42-.88-1.46-.17-3-.73-3-3.25 0-.72.26-1.3.68-1.76-.07-.17-.3-.86.06-1.75 0 0 .55-.18 1.8.67a6.2 6.2 0 0 1 3.27 0c1.25-.85 1.8-.67 1.8-.67.36.89.13 1.58.06 1.75.42.46.68 1.04.68 1.76 0 2.53-1.55 3.08-3.01 3.25.24.21.45.62.45 1.25v1.85c0 .18.12.39.45.32A6.5 6.5 0 0 0 9 2.5Z"/>,
    spark: <><path d="m9 2 1.1 4.1L14 7.2l-3.9 1.1L9 12.4 7.9 8.3 4 7.2l3.9-1.1L9 2Z"/><path d="m15 11 .55 2.05L17.6 13.6l-2.05.55L15 16.2l-.55-2.05-2.05-.55 2.05-.55L15 11Z"/></>,
    review: <><path d="M4 4h10v9H4z"/><path d="M7 7h4M7 10h3"/><path d="m12 14 2 2 3-4"/></>,
    bug: <><path d="M8 5h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"/><path d="M8 2v3M10 2v3M3 8h2M3 11h2M13 8h2M13 11h2M6 13l-1 2M12 13l1 2"/></>,
    tools: <><path d="m11 3 2 2-3 3-2-2 3-3Z"/><path d="m8 8-5 5 3 3 5-5"/><path d="m13 10 3 3-2 2-3-3"/></>,
    history: <><path d="M3 8a6 6 0 1 0 2-4"/><path d="M3 3v5h5"/><path d="M9 6v3l2 1"/></>,
    send: <><path d="m3 3 13 6-13 6 3-6-3-6Z"/><path d="M6 9h10"/></>,
    folder: <><path d="M2.5 5.5h5l1.5 1.5h6.5v7.5h-13z"/></>,
    search: <><circle cx="8" cy="8" r="5"/><path d="m12 12 4 4"/></>,
    shield: <><path d="M9 2.5 15 5v4c0 3.8-2.6 6-6 7-3.4-1-6-3.2-6-7V5l6-2.5Z"/><path d="m6.5 9 1.7 1.7L12 7"/></>,
    graph: <><circle cx="4" cy="13" r="1.5"/><circle cx="9" cy="5" r="1.5"/><circle cx="14" cy="12" r="1.5"/><path d="m5.3 11.7 2.4-5.4M10.4 6.2l2.2 4.5"/></>,
    test: <><path d="M6 2v5l-3 7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l-3-7V2"/><path d="M6 5h5M5 12h6"/></>,
    close: <><path d="m4 4 10 10M14 4 4 14"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const ResultBox = ({ title, text, loading }) => (
  <div className="adt-result-box">
    <div className="adt-result-head"><strong>{title}</strong>{loading && <span className="adt-status-dot" />}</div>
    <ReadableAIResponse content={loading ? "Working through repository context..." : (text || "Run the tool to generate an engineering result.")} />
  </div>
);

function Home() {
  const [theme, setTheme] = useState(() => localStorage.getItem("adt_theme") || "cyan");
  const [user, setUser] = useState(() => { const s = localStorage.getItem("auth_user"); return s ? JSON.parse(s) : null; });
  const [error, setError] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [repo, setRepo] = useState(null);
  const [busy, setBusy] = useState("");
  const [tab, setTab] = useState("AI Chat");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [tree, setTree] = useState(null);
  const [selectedPath, setSelectedPath] = useState("");
  const [file, setFile] = useState(null);
  const [overview, setOverview] = useState("");
  const [agentQuestion, setAgentQuestion] = useState("");
  const [agentResult, setAgentResult] = useState("");
  const [reviewCode, setReviewCode] = useState("");
  const [reviewResult, setReviewResult] = useState("");
  const [debugError, setDebugError] = useState("");
  const [debugCode, setDebugCode] = useState("");
  const [debugResult, setDebugResult] = useState("");
  const [securityResult, setSecurityResult] = useState("");
  const [testResult, setTestResult] = useState("");
  const [diff, setDiff] = useState("");
  const [diffResult, setDiffResult] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [evalInput, setEvalInput] = useState('[{"question":"How does authentication work?","expectedPaths":["backend/src/controllers/authController.js"]}]');
  const [evalResult, setEvalResult] = useState(null);
  const [generalResponse, setGeneralResponse] = useState("");
  const [generalLoading, setGeneralLoading] = useState(false);

  useEffect(() => { document.documentElement.dataset.adtTheme = theme; localStorage.setItem("adt_theme", theme); }, [theme]);

  const requireRepo = () => { if (!repo?.repository?.id) { setError("Index a repository first."); return false; } return true; };
  const run = async (key, fn) => { try { setBusy(key); setError(""); await fn(); } catch (e) { setError(e.message || "Request failed"); } finally { setBusy(""); } };

  const preview = () => run("preview", async () => setMetadata((await getGitHubRepositoryMetadata(repositoryUrl.trim())).repository));
  const index = () => run("index", async () => setRepo(await indexGitHubRepository(repositoryUrl.trim())));

  const loadRepository = async (r) => {
    const id = r?.repository?.id; if (!id) return;
    try { const t = await getRepositoryTree(id); setTree(t); if (t.files?.[0]) { setSelectedPath(t.files[0]); setFile(await getRepositoryFile(id, t.files[0])); } setTelemetry(await getRagTelemetry(id)); } catch (e) { setError(e.message); }
  };
  useEffect(() => { if (repo) loadRepository(repo); }, [repo]);

  const ask = (e) => { e.preventDefault(); if (!requireRepo() || !question.trim()) return; run("qa", async () => { const r = await askRepositoryQuestion(repo.repository.id, question.trim()); setAnswer(r.response); setSources(r.sources || []); setTab("AI Chat"); }); };
  const selectFile = (path) => run("file", async () => { setSelectedPath(path); setFile(await getRepositoryFile(repo.repository.id, path)); setTab("Files"); });
  const analyze = () => run("analyze", async () => { const r = await analyzeRepository(repo.repository.id); setOverview(r.analysis); setSources(r.sources || []); setTab("Overview"); });
  const agent = (e) => { e.preventDefault(); if (!requireRepo() || !agentQuestion.trim()) return; run("agent", async () => setAgentResult((await runRepositoryAgent(repo.repository.id, agentQuestion)).response)); };
  const codeReview = () => { if (!requireRepo() || !reviewCode.trim()) return; run("review", async () => setReviewResult((await runCodeReview(repo.repository.id, reviewCode, "auto-detect")).review)); };
  const debug = () => { if (!requireRepo() || !debugError.trim()) return; run("debug", async () => setDebugResult((await runDebugging(repo.repository.id, debugError, debugCode)).investigation)); };
  const security = () => { if (!requireRepo()) return; run("security", async () => setSecurityResult((await runSecurityScan(repo.repository.id)).report)); };
  const tests = () => { if (!requireRepo() || !selectedPath) return; run("tests", async () => setTestResult((await generateTests(repo.repository.id, selectedPath)).tests)); };
  const diffReview = () => { if (!requireRepo() || !diff.trim()) return; run("diff", async () => setDiffResult((await reviewDiff(repo.repository.id, diff)).review)); };
  const search = () => { if (!requireRepo() || !searchQuery.trim()) return; run("search", async () => setSearchResults((await searchRepository(repo.repository.id, searchQuery)).results || [])); };
  const evaluate = () => { if (!requireRepo()) return; run("evaluate", async () => setEvalResult(await evaluateRetrieval(repo.repository.id, JSON.parse(evalInput)))); };
  const generalAsk = async (prompt) => { try { setGeneralLoading(true); setError(""); setGeneralResponse((await getAIResponse(prompt)).response); } catch (e) { setError(e.message); } finally { setGeneralLoading(false); } };

  const nav = [
    ["Home", "home", "#home"], ["AI Workspace", "spark", "#workspace"], ["GitHub", "github", "#repository"],
    ["Code Review", "review", "#code-review"], ["Debugging Lab", "bug", "#debugging"], ["Developer Tools", "tools", "#tools"],
  ];
  const featureStats = useMemo(() => [
    [tree?.fileCount || 0, "Files indexed"], [tree?.chunkCount || repo?.chunkCount || 0, "RAG chunks"], [telemetry?.avgChunkSize || 0, "Avg chunk chars"],
  ], [tree, repo, telemetry]);

  return <div className="adt-shell min-h-screen"><div className="adt-atmosphere" />
    <header className="adt-header"><div className="adt-header-inner">
      <Link to="/" className="adt-brand"><span className="adt-brand-mark"><Icon name="spark" size={20} /></span><span>AI DEVELOPER TOOLBOX</span></Link>
      <div className="adt-search"><span>Search or ask anything...</span><kbd>⌘ K</kbd></div>
      <div className="adt-header-actions"><div className="adt-theme-toggle"><button className={theme === "silver" ? "active" : ""} onClick={() => setTheme("silver")}>✦ Gold</button><button className={theme === "cyan" ? "active" : ""} onClick={() => setTheme("cyan")}>✦ Cyan</button></div><span className="adt-pro-badge">✦ Pro</span>{user ? <button className="adt-avatar" onClick={() => { localStorage.removeItem("auth_token"); localStorage.removeItem("auth_user"); setUser(null); }}> {(user.name || "U").charAt(0).toUpperCase()}</button> : <div className="adt-google-login"><GoogleLogin onSuccess={async (credentialResponse) => { try { const res = await fetch(`${API_URL}/api/auth/google`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential: credentialResponse.credential }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error || "Authentication failed"); localStorage.setItem("auth_token", data.token); localStorage.setItem("auth_user", JSON.stringify(data.user)); setUser(data.user); } catch (e) { setError(e.message); } }} onError={() => setError("Google sign-in failed")} theme="filled_black" size="medium" /></div>}</div>
    </div></header>
    <div className="adt-layout">
      <aside className="adt-sidebar"><nav>{nav.map(([label, icon, href]) => <a key={label} href={href} className="adt-nav-item"><Icon name={icon} size={17}/><span>{label}</span></a>)}<Link to="/history" className="adt-nav-item"><Icon name="history" size={17}/><span>History</span></Link></nav><div className="adt-sidebar-footer"><span className="adt-status-dot"/> AI systems online</div></aside>
      <main className="adt-main">
        <section id="home" className="adt-hero"><div><span className="adt-eyebrow">AI engineering platform</span><h1>Understand, review,<br/><span>debug your codebase.</span></h1><p>Understand your codebase with repository-grounded AI, intelligent code exploration and contextual answers.</p></div><div className="adt-hero-orbit"><div className="adt-orbit-core"><Icon name="graph" size={28}/></div><div className="adt-orbit-ring ring-a"/><div className="adt-orbit-ring ring-b"/></div></section>

        <section id="repository" className="adt-panel adt-repository-panel">
          <div className="adt-panel-heading"><div><span className="adt-eyebrow">Repository intelligence</span><h2><span className="adt-heading-icon"><Icon name="github" size={20}/></span> GitHub Repository</h2><p>Index a public repository and turn its source into an auditable AI knowledge base.</p></div><div className="adt-repo-actions"><button className="adt-secondary-button active"><Icon name="github" size={16}/> Public Repository</button>{repo && <button className="adt-secondary-button" onClick={analyze} disabled={busy === "analyze"}><Icon name="spark" size={16}/> {busy === "analyze" ? "Analyzing..." : "Analyze architecture"}</button>}</div></div>
          <div className="adt-analyze-row"><input value={repositoryUrl} onChange={e => { setRepositoryUrl(e.target.value); setMetadata(null); }} placeholder="https://github.com/owner/repository"/><button className="adt-primary-button" onClick={preview} disabled={!repositoryUrl.trim() || busy === "preview"}>{busy === "preview" ? "Loading..." : "Analyze"}</button></div>
          {error && <div className="adt-error adt-global-error">{error}</div>}
          {metadata && <div className="adt-repo-card"><div className="adt-repo-main"><div className="adt-github-logo"><Icon name="github" size={28}/></div><div><h3>{metadata.fullName}</h3><p>{metadata.description || "No description provided."}</p><div className="adt-tags"><span>{metadata.language || "Source"}</span><span>{metadata.private ? "Private" : "Public"}</span><span>↳ {metadata.defaultBranch || "main"}</span></div></div></div><div className="adt-repo-meta"><span>Default branch</span><strong>{metadata.defaultBranch || "main"}</strong><span>Index status</span><strong>{repo ? "Ready" : "Not indexed"}</strong>{user ? <button className="adt-index-button" onClick={index} disabled={busy === "index"}>{busy === "index" ? "Indexing..." : repo ? "Re-index repository" : "Index repository"}</button> : <small>Sign in to index</small>}</div></div>}
          {repo?.repository?.id && <>
            <div className="adt-success"><span className="adt-status-dot"/> Repository indexed · {repo.chunkCount || tree?.chunkCount} chunks ready · commit {repo.repository.commitSha?.slice(0, 8)}</div>
            <div className="adt-stat-strip">{featureStats.map(([v,l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}<div><strong>{telemetry?.evaluationStatus === "benchmark-not-configured" ? "Ready" : "Measured"}</strong><span>RAG evaluation</span></div></div>
            <div className="adt-tabs">{["Files", "Overview", "AI Chat", "Insights"].map(t => <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>
            <div className="adt-repo-workspace">
              <aside className="adt-file-tree"><div className="adt-mini-label">Repository files</div>{tree?.files?.slice(0, 160).map(path => <button key={path} className={`adt-file ${selectedPath === path ? "selected" : ""}`} onClick={() => selectFile(path)}><Icon name="folder" size={12}/><code>{path}</code></button>)}{!tree && <div className="adt-empty">Loading repository tree...</div>}</aside>
              <div className="adt-chat-pane">
                {tab === "Files" && <div><div className="adt-section-title"><span>{selectedPath || "Select a file"}</span><small>{file ? `${file.chunks.length} chunks` : "Code explorer"}</small></div>{file ? <pre className="adt-code-viewer">{file.content}</pre> : <div className="adt-chat-empty"><div className="adt-ai-icon"><Icon name="code"/></div><div><strong>Click a file to inspect it.</strong><p>Use the AI tools below to generate tests or ask the repository agent about the selected file.</p></div></div>}</div>}
                {tab === "Overview" && <div><div className="adt-section-title"><span>Architecture analysis</span><small>AI-grounded + structural map</small></div><div className="adt-graph"><div className="adt-graph-core">{repo?.repository?.fullName || "Repository"}</div><div className="adt-graph-grid">{(tree?.directories || []).slice(0, 10).map((dir) => <div className="adt-graph-node" key={dir}><Icon name="folder" size={14}/><span>{dir}</span></div>)}</div></div><ResultBox title="Repository architecture" text={overview} loading={busy === "analyze"}/>{!overview && <button className="adt-primary-button adt-small-action" onClick={analyze} disabled={busy === "analyze"}>Generate architecture report</button>}</div>}
                {tab === "AI Chat" && <form onSubmit={ask}><div className="adt-chat-question"><span>You</span><p>{question || "Ask anything about this repository..."}</p></div>{answer ? <div className="adt-chat-answer"><div className="adt-ai-icon"><Icon name="spark" size={17}/></div><div><div className="adt-answer-label">Grounded AI analysis</div><ReadableAIResponse content={answer} /></div></div> : <div className="adt-chat-empty"><div className="adt-ai-icon"><Icon name="spark" size={17}/></div><div><strong>Repository context is ready.</strong><p>Hybrid retrieval, repository-scoped context and source references keep answers grounded.</p></div></div>}<div className="adt-chat-input-wrap"><textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} maxLength={5000} placeholder="Ask anything about this repository..."/><button className="adt-send-button" disabled={busy === "qa" || !question.trim()}><Icon name="send" size={18}/></button></div>{sources.length > 0 && <div className="adt-sources"><span>Sources</span>{sources.map(s => <button type="button" key={`${s.path}:${s.chunkIndex}`} onClick={() => selectFile(s.path)}>[{s.index}] {s.path}</button>)}</div>}</form>}
                {tab === "Insights" && <div className="adt-insights-grid"><div><span>Files</span><strong>{tree?.fileCount || "—"}</strong></div><div><span>Chunks</span><strong>{tree?.chunkCount || "—"}</strong></div><div><span>Avg chunk</span><strong>{telemetry?.avgChunkSize || "—"}</strong></div><div><span>Retrieval</span><strong>Scoped</strong></div><div><span>Isolation</span><strong>User + commit</strong></div><div><span>Evaluation</span><strong>{telemetry?.evaluationStatus === "benchmark-not-configured" ? "Configure" : "Measured"}</strong></div></div>}
              </div>
            </div>
          </>}
        </section>

        <section id="workspace" className="adt-workspace-grid"><div><div className="adt-section-title"><span>AI Workspace</span><small>General engineering assistance</small></div><PromptForm onSubmit={generalAsk} loading={generalLoading} darkMode={true}/></div><div><div className="adt-section-title"><span>AI Response</span><small>General-purpose reasoning</small></div><ResponseCard response={generalResponse} darkMode={true}/></div></section>


        <footer className="adt-footer"><span>AI Developer Toolbox · AI Engineering Platform</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></footer>
      </main>
    </div>
  </div>;
}

export default Home;
