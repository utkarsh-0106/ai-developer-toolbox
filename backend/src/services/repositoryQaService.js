import mongoose from "mongoose";
import RepositoryChunk from "../models/RepositoryChunk.js";
import Repository from "../models/Repository.js";

const STOP_WORDS = new Set([
  "the", "and", "for", "that", "this", "with", "from", "what", "when",
  "where", "which", "who", "how", "does", "work", "why", "can", "could",
  "would", "should", "about", "into", "have", "has", "are", "was", "were",
  "is", "in", "on", "to", "of", "a", "an", "it", "its", "my", "your",
  "our", "their", "be", "do", "i", "we", "you", "me", "as", "or", "at",
  "by", "using", "use", "please", "tell", "explain", "show"
]);

function extractSearchTerms(question) {
  return [...new Set(
    String(question)
      .toLowerCase()
      .replace(/[^a-z0-9_./-]+/g, " ")
      .split(/\s+/)
      .filter((term) => term.length >= 3 && !STOP_WORDS.has(term))
  )].slice(0, 8);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countOccurrences(text, term) {
  let count = 0;
  let index = 0;

  while (true) {
    index = text.indexOf(term, index);

    if (index === -1) {
      break;
    }

    count += 1;
    index += term.length;

    if (count >= 20) {
      break;
    }
  }

  return count;
}

function scoreChunk(chunk, terms) {
  const content = String(chunk.content || "").toLowerCase();
  const path = String(chunk.path || "").toLowerCase();

  let score = 0;

  for (const term of terms) {
    score += Math.min(countOccurrences(content, term), 6) * 2;

    if (path.includes(term)) {
      score += 8;
    }
  }

  if (/readme|package\.json|\.env|config|auth|server|controller|service|route|model|middleware/i.test(path)) {
    score += 1;
  }

  if (path.toLowerCase().endsWith("readme.md")) {
    score += 2;
  }

  return score;
}

async function retrieveRepositoryChunks({
  userId,
  repositoryId,
  question,
  limit = 8,
}) {
  if (!mongoose.isValidObjectId(repositoryId)) {
    throw new Error("Invalid repository ID");
  }

  const repository = await Repository.findOne({
    _id: repositoryId,
    userId,
  }).lean();

  if (!repository) {
    throw new Error("Repository not found");
  }

  if (repository.indexingStatus !== "ready") {
    throw new Error("Repository is not ready for questions");
  }

  const terms = extractSearchTerms(question);

  const query = {
    userId,
    repositoryId: repository._id,
    commitSha: repository.lastIndexedCommitSha,
  };

  if (terms.length > 0) {
    query.$or = terms.map((term) => ({
      $or: [
        { content: { $regex: escapeRegex(term), $options: "i" } },
        { path: { $regex: escapeRegex(term), $options: "i" } },
      ],
    }));
  }

  let candidates = await RepositoryChunk.find(query)
    .select("path chunkIndex start end content size")
    .limit(300)
    .lean();

  if (candidates.length === 0) {
    candidates = await RepositoryChunk.find({
      userId,
      repositoryId: repository._id,
      commitSha: repository.lastIndexedCommitSha,
    })
      .select("path chunkIndex start end content size")
      .sort({ path: 1, chunkIndex: 1 })
      .limit(100)
      .lean();
  }

  const ranked = candidates
    .map((chunk) => ({
      ...chunk,
      relevanceScore: scoreChunk(chunk, terms),
    }))
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      if (a.path !== b.path) {
        return a.path.localeCompare(b.path);
      }

      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, limit);

  return {
    repository,
    terms,
    chunks: ranked,
  };
}

function buildRepositoryPrompt(question, repository, chunks) {
  const sourceBlocks = chunks.map((chunk, index) => {
    return [
      `[SOURCE ${index + 1}] ${chunk.path} (chunk ${chunk.chunkIndex})`,
      chunk.content,
      `[END SOURCE ${index + 1}]`,
    ].join("\n");
  });

  return `You are the repository intelligence assistant for an AI developer tool.

Answer the user's question using ONLY the repository context below.
Do not invent files, functions, behavior, dependencies, or architecture that are not supported by the provided context.

Repository: ${repository.fullName}
Branch: ${repository.defaultBranch}
Indexed commit: ${repository.lastIndexedCommitSha}

User question:
${question}

Repository context:
${sourceBlocks.join("\n\n")}

Rules:
1. Give a direct engineering answer first.
2. Explain the relevant implementation in simple technical language.
3. When making a claim from repository context, cite it using [1], [2], etc. matching the source numbers.
4. If the provided context is insufficient, clearly say what cannot be determined instead of guessing.
5. Do not claim that you inspected files that are not present in the context.
6. Keep the answer concise but useful.
`;
}

async function answerRepositoryQuestion({
  userId,
  repositoryId,
  question,
  aiService,
}) {
  const retrieval = await retrieveRepositoryChunks({
    userId,
    repositoryId,
    question,
  });

  if (retrieval.chunks.length === 0) {
    throw new Error("No relevant repository context found");
  }

  const prompt = buildRepositoryPrompt(
    question,
    retrieval.repository,
    retrieval.chunks
  );

  const response = await aiService.generateResponse(prompt);

  const sources = retrieval.chunks.map((chunk, index) => ({
    index: index + 1,
    path: chunk.path,
    chunkIndex: chunk.chunkIndex,
    start: chunk.start,
    end: chunk.end,
    relevanceScore: chunk.relevanceScore,
  }));

  return {
    response,
    sources,
    repository: {
      id: retrieval.repository._id,
      fullName: retrieval.repository.fullName,
      branch: retrieval.repository.defaultBranch,
      commitSha: retrieval.repository.lastIndexedCommitSha,
    },
  };
}

export {
  answerRepositoryQuestion,
  retrieveRepositoryChunks,
  buildRepositoryPrompt,
};
