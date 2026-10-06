const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "VITE_API_BASE_URL is not configured for the production frontend."
  );
}

const request = async (url, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error(
      "Production API URL is not configured. Set VITE_API_BASE_URL."
    );
  }
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || data?.message || `API request failed with status ${response.status}`);
  return data;
};

const authHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Please sign in before using repository intelligence");
  return { Authorization: `Bearer ${token}` };
};

export const getAIResponse = (prompt) => request(`${API_BASE_URL}/api/ai/ask`, { method: "POST", body: JSON.stringify({ prompt }) });
export const getHistory = () => request(`${API_BASE_URL}/api/ai/history`);
export const deleteHistoryItem = (id) => request(`${API_BASE_URL}/api/ai/history/${id}`, { method: "DELETE" });
export const indexGitHubRepository = (repositoryUrl) => request(`${API_BASE_URL}/api/github/index`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ repositoryUrl }) });
export const getGitHubRepositoryMetadata = (repositoryUrl) => request(`${API_BASE_URL}/api/github/public/repository`, { method: "POST", body: JSON.stringify({ repositoryUrl }) });
export const askRepositoryQuestion = (repositoryId, question) => request(`${API_BASE_URL}/api/repository/qa`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ repositoryId, question }) });

const intelligence = (repositoryId, path, options = {}) => request(`${API_BASE_URL}/api/repository-intelligence/${repositoryId}${path}`, { ...options, headers: { ...authHeaders(), ...(options.headers || {}) } });
export const getRepositoryTree = (id) => intelligence(id, "/tree");
export const getRepositoryFile = (id, path) => intelligence(id, `/file?path=${encodeURIComponent(path)}`);
export const analyzeRepository = (id) => intelligence(id, "/analyze", { method: "POST", body: JSON.stringify({}) });
export const runRepositoryAgent = (id, question) => intelligence(id, "/agent", { method: "POST", body: JSON.stringify({ question }) });
export const runCodeReview = (id, code, language) => intelligence(id, "/review", { method: "POST", body: JSON.stringify({ code, language }) });
export const runDebugging = (id, error, code) => intelligence(id, "/debug", { method: "POST", body: JSON.stringify({ error, code }) });
export const runSecurityScan = (id) => intelligence(id, "/security", { method: "POST", body: JSON.stringify({}) });
export const generateTests = (id, path) => intelligence(id, "/tests", { method: "POST", body: JSON.stringify({ path }) });
export const reviewDiff = (id, diff) => intelligence(id, "/diff-review", { method: "POST", body: JSON.stringify({ diff }) });
export const searchRepository = (id, query, limit = 10) => intelligence(id, "/search", { method: "POST", body: JSON.stringify({ query, limit }) });
export const getRagTelemetry = (id) => intelligence(id, "/telemetry");
export const evaluateRetrieval = (id, cases) => intelligence(id, "/evaluate", { method: "POST", body: JSON.stringify({ cases }) });
