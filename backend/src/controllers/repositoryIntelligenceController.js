import AIService from "../services/aiService.js";
import {
  getRepositoryTree, getRepositoryFile, repositoryAnalysis, runRepositoryAgent,
  runCodeReview, runDebugging, runSecurityScan, generateTests, reviewDiff,
  hybridSearch, ragTelemetry, evaluateRetrieval,
} from "../services/repositoryIntelligenceService.js";

const ai = () => new AIService();
const ok = (fn) => async (req, res) => {
  try { return res.json(await fn(req)); }
  catch (error) {
    console.error("Repository intelligence error:", error);
    const message = error?.message || "Repository intelligence request failed";
    const status = ["Repository not found", "Invalid repository ID"].includes(message) ? 404 : 400;
    return res.status(status).json({ message });
  }
};

export const repositoryTree = ok((req) => getRepositoryTree({ userId: req.user._id, repositoryId: req.params.repositoryId }));
export const repositoryFile = ok((req) => getRepositoryFile({ userId: req.user._id, repositoryId: req.params.repositoryId, path: req.query.path }));
export const repositoryAnalyze = ok((req) => repositoryAnalysis({ userId: req.user._id, repositoryId: req.params.repositoryId, aiService: ai() }));
export const repositoryAgent = ok((req) => runRepositoryAgent({ userId: req.user._id, repositoryId: req.params.repositoryId, question: req.body?.question, aiService: ai() }));
export const codeReview = ok((req) => runCodeReview({ userId: req.user._id, repositoryId: req.params.repositoryId, code: req.body?.code, language: req.body?.language, aiService: ai() }));
export const debugging = ok((req) => runDebugging({ userId: req.user._id, repositoryId: req.params.repositoryId, error: req.body?.error, code: req.body?.code, aiService: ai() }));
export const securityScan = ok((req) => runSecurityScan({ userId: req.user._id, repositoryId: req.params.repositoryId, aiService: ai() }));
export const testGeneration = ok((req) => generateTests({ userId: req.user._id, repositoryId: req.params.repositoryId, path: req.body?.path, aiService: ai() }));
export const diffReview = ok((req) => reviewDiff({ userId: req.user._id, repositoryId: req.params.repositoryId, diff: req.body?.diff, aiService: ai() }));
export const search = ok((req) => hybridSearch({ userId: req.user._id, repositoryId: req.params.repositoryId, query: req.body?.query, limit: req.body?.limit || 10 }));
export const telemetry = ok((req) => ragTelemetry({ userId: req.user._id, repositoryId: req.params.repositoryId }));
export const evaluate = ok((req) => evaluateRetrieval({ userId: req.user._id, repositoryId: req.params.repositoryId, cases: req.body?.cases }));
