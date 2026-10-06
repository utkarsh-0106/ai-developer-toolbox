import mongoose from "mongoose";
import Repository from "../models/Repository.js";
import RepositoryChunk from "../models/RepositoryChunk.js";
import { retrieveRepositoryChunks } from "./repositoryQaService.js";

function ensureRepoId(repositoryId) {
  if (!mongoose.isValidObjectId(repositoryId)) throw new Error("Invalid repository ID");
}

async function getRepository(userId, repositoryId) {
  ensureRepoId(repositoryId);
  const repository = await Repository.findOne({ _id: repositoryId, userId }).lean();
  if (!repository) throw new Error("Repository not found");
  if (repository.indexingStatus !== "ready") throw new Error("Repository is not ready for analysis");
  return repository;
}

function unique(values) { return [...new Set(values.filter(Boolean))]; }

export async function getRepositoryTree({ userId, repositoryId }) {
  const repository = await getRepository(userId, repositoryId);
  const rows = await RepositoryChunk.find({
    userId,
    repositoryId: repository._id,
    commitSha: repository.lastIndexedCommitSha,
  }).select("path chunkIndex content").sort({ path: 1, chunkIndex: 1 }).lean();

  const files = unique(rows.map((row) => row.path));
  const directories = unique(files.map((path) => {
    const parts = path.split("/");
    return parts.length > 1 ? parts.slice(0, -1).join("/") : "";
  }).filter(Boolean));

  return {
    repository: { id: repository._id, fullName: repository.fullName, branch: repository.defaultBranch, commitSha: repository.lastIndexedCommitSha },
    files,
    directories,
    fileCount: files.length,
    chunkCount: rows.length,
  };
}

export async function getRepositoryFile({ userId, repositoryId, path }) {
  const repository = await getRepository(userId, repositoryId);
  if (!path || path.length > 500) throw new Error("path is required");
  const chunks = await RepositoryChunk.find({
    userId,
    repositoryId: repository._id,
    commitSha: repository.lastIndexedCommitSha,
    path,
  }).select("path chunkIndex start end content").sort({ chunkIndex: 1 }).lean();
  if (!chunks.length) throw new Error("File not found in indexed repository");
  let content = "";
  let cursor = 0;
  for (const chunk of chunks) {
    const overlap = Math.max(0, cursor - chunk.start);
    content += String(chunk.content || "").slice(overlap);
    cursor = Math.max(cursor, chunk.end);
  }
  return { repository: { id: repository._id, fullName: repository.fullName, commitSha: repository.lastIndexedCommitSha }, path, chunks, content };
}

function buildPrompt(title, repository, context, instructions) {
  return `You are an AI software engineering assistant analyzing repository ${repository.fullName}.\nIndexed commit: ${repository.lastIndexedCommitSha}\n\nTASK: ${title}\n\n${instructions}\n\nREPOSITORY CONTEXT:\n${context}\n\nRules:\n- Ground claims in the supplied repository context.\n- Never invent files or behavior.\n- If evidence is missing, say so explicitly.\n- Prefer actionable engineering recommendations.\n- Use source references like [1], [2] when source labels exist.\n`;
}

function sourceContext(chunks) {
  return chunks.map((c, i) => `[SOURCE ${i + 1}] ${c.path} (chunk ${c.chunkIndex})\n${c.content}\n[END SOURCE ${i + 1}]`).join("\n\n");
}

export async function repositoryAnalysis({ userId, repositoryId, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: "architecture dependencies authentication database API services frontend backend configuration", limit: 14 });
  const context = sourceContext(retrieval.chunks);
  const prompt = buildPrompt("Repository architecture analysis", repository, context, `Produce sections: Executive Summary, Architecture, Request/Data Flow, Major Modules, Technologies, Authentication, Data Storage, AI/RAG Flow, Risks, and Suggested Improvements. Keep each section concise and cite supplied sources.`);
  return { analysis: await aiService.generateResponse(prompt), sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path, chunkIndex: c.chunkIndex, start: c.start, end: c.end })) };
}

export async function runRepositoryAgent({ userId, repositoryId, question, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question, limit: 10 });
  const topPaths = unique(retrieval.chunks.slice(0, 3).map((c) => c.path));
  const fileTools = [];
  for (const path of topPaths) {
    try {
      const file = await getRepositoryFile({ userId, repositoryId, path });
      fileTools.push({ path, content: file.content.slice(0, 12000) });
    } catch {
      // A chunk can still be useful even when a complete file cannot be reconstructed.
    }
  }
  const context = [
    "SEARCH_TOOL_RESULTS",
    sourceContext(retrieval.chunks),
    "READ_FILE_TOOL_RESULTS",
    fileTools.map((f, i) => `[FILE ${i + 1}] ${f.path}\n${f.content}\n[END FILE ${i + 1}]`).join("\n\n"),
  ].join("\n\n");
  const prompt = buildPrompt("Multi-step repository agent", repository, context, `Act as an engineering agent. User request: ${question}\n\nYou have already executed these internal tools: search_repository and read_file. Explain the tool-assisted investigation, trace the relevant implementation, identify evidence, and finish with a concrete action plan. If a code change is appropriate, provide a minimal patch-style suggestion. Cite sources. Never pretend you executed tools that are not listed.`);
  return { response: await aiService.generateResponse(prompt), steps: ["search_repository", "read_file", "reason_over_evidence", "produce_action_plan"], sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path, chunkIndex: c.chunkIndex, start: c.start, end: c.end })) };
}

export async function runCodeReview({ userId, repositoryId, code, language, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: `${language || "code"} conventions error handling security testing architecture`, limit: 8 });
  const prompt = buildPrompt("Code review", repository, sourceContext(retrieval.chunks), `Review the following ${language || "source"} code:\n\n${code}\n\nReturn: Summary, Critical/High/Medium/Low findings, Security, Performance, Maintainability, Suggested patch, Tests to add. Do not claim repository facts without evidence.`);
  return { review: await aiService.generateResponse(prompt), sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path })) };
}

export async function runDebugging({ userId, repositoryId, error, code, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: `${error} ${code || ""}`, limit: 10 });
  const prompt = buildPrompt("Debugging investigation", repository, sourceContext(retrieval.chunks), `Investigate this issue. Error/log: ${error}\nCode/context: ${code || "not supplied"}\nReturn: Confirmed evidence, likely root cause, contributing causes, exact fix, verification steps, and prevention. Separate confirmed facts from hypotheses.`);
  return { investigation: await aiService.generateResponse(prompt), sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path })) };
}

export async function runSecurityScan({ userId, repositoryId, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: "security secrets JWT authentication authorization CORS injection XSS CSRF passwords environment API keys", limit: 16 });
  const prompt = buildPrompt("Security audit", repository, sourceContext(retrieval.chunks), `Audit the supplied repository evidence for hardcoded secrets, auth weaknesses, injection risks, unsafe configuration, CORS/CSRF/XSS concerns, dependency/configuration risks, and data isolation issues. Return a severity table and remediation plan. Do not assert a vulnerability without evidence.`);
  return { report: await aiService.generateResponse(prompt), sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path })) };
}

export async function generateTests({ userId, repositoryId, path, aiService }) {
  const file = await getRepositoryFile({ userId, repositoryId, path });
  const prompt = `You are generating tests for ${file.path} in ${file.repository.fullName}.\nSource:\n${file.content}\n\nGenerate practical tests for happy paths, edge cases, failures, security boundaries, and regression cases. Detect the likely test framework from source/context when possible. If uncertain, state the assumption. Return runnable test code plus a short test plan.`;
  return { tests: await aiService.generateResponse(prompt), path: file.path };
}

export async function reviewDiff({ userId, repositoryId, diff, aiService }) {
  const repository = await getRepository(userId, repositoryId);
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: "changed code affected services APIs authentication tests database", limit: 10 });
  const prompt = buildPrompt("Pull request / diff review", repository, sourceContext(retrieval.chunks), `Review this diff:\n\n${diff}\n\nIdentify correctness, security, performance, compatibility, missing tests, and architectural concerns. Return actionable findings ordered by severity.`);
  return { review: await aiService.generateResponse(prompt), sources: retrieval.chunks.map((c, i) => ({ index: i + 1, path: c.path })) };
}

export async function hybridSearch({ userId, repositoryId, query, limit = 10 }) {
  const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: query, limit });
  return {
    mode: "hybrid-lexical-structural",
    note: "Ranks keyword matches together with repository path and structural signals; vector embeddings are not stored in this version.",
    results: retrieval.chunks.map((c, i) => ({ rank: i + 1, path: c.path, chunkIndex: c.chunkIndex, score: c.relevanceScore, preview: c.content.slice(0, 420) })),
  };
}

export async function ragTelemetry({ userId, repositoryId }) {
  const tree = await getRepositoryTree({ userId, repositoryId });
  const repository = await getRepository(userId, repositoryId);
  const chunks = await RepositoryChunk.find({ userId, repositoryId: repository._id, commitSha: repository.lastIndexedCommitSha }).select("size").lean();
  const avgChunkSize = chunks.length ? Math.round(chunks.reduce((s, c) => s + (c.size || 0), 0) / chunks.length) : 0;
  return {
    indexed: true,
    files: tree.fileCount,
    chunks: tree.chunkCount,
    avgChunkSize,
    commitSha: repository.lastIndexedCommitSha,
    indexedAt: repository.lastIndexedAt,
    evaluationStatus: "benchmark-not-configured",
    evaluationNote: "Use the evaluation harness to submit expected source paths and measure retrieval hit@k.",
  };
}

export async function evaluateRetrieval({ userId, repositoryId, cases }) {
  const results = [];
  for (const item of Array.isArray(cases) ? cases.slice(0, 20) : []) {
    const query = String(item.question || "").trim();
    const expected = Array.isArray(item.expectedPaths) ? item.expectedPaths : [];
    if (!query) continue;
    const retrieval = await retrieveRepositoryChunks({ userId, repositoryId, question: query, limit: 8 });
    const paths = unique(retrieval.chunks.map((c) => c.path));
    const hit = expected.length === 0 ? null : expected.some((p) => paths.includes(p));
    results.push({ question: query, expectedPaths: expected, retrievedPaths: paths, hitAt8: hit });
  }
  const measured = results.filter((r) => r.hitAt8 !== null);
  const hitRate = measured.length ? Math.round((measured.filter((r) => r.hitAt8).length / measured.length) * 100) : null;
  return { totalCases: results.length, measuredCases: measured.length, hitAt8: hitRate, results };
}
