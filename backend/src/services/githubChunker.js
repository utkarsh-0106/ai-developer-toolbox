const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

function normalizeText(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function findChunkEnd(text, start, targetEnd) {
  if (targetEnd >= text.length) {
    return text.length;
  }

  const newline = text.lastIndexOf("\n", targetEnd);

  if (newline > start + 200) {
    return newline;
  }

  return targetEnd;
}

function chunkText(text, chunkSize, overlap) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return [];
  }

  const chunks = [];
  let start = 0;
  let guard = 0;

  while (start < normalized.length) {
    guard += 1;

    if (guard > normalized.length + 10) {
      throw new Error("Chunking safety limit exceeded");
    }

    const targetEnd = Math.min(
      start + chunkSize,
      normalized.length
    );

    const end = findChunkEnd(
      normalized,
      start,
      targetEnd
    );

    const safeEnd = Math.max(
      end,
      Math.min(start + 1, normalized.length)
    );

    chunks.push({
      start,
      end: safeEnd,
      content: normalized.slice(start, safeEnd),
    });

    if (safeEnd >= normalized.length) {
      break;
    }

    const nextStart = safeEnd - overlap;

    // Critical safety guarantee: cursor must always move forward.
    start = Math.max(
      start + 1,
      nextStart
    );
  }

  return chunks;
}

function chunkRepositoryFiles(
  files,
  chunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP,
  repositoryContext = {}
) {
  if (!Array.isArray(files)) {
    throw new Error("Repository files must be an array");
  }

  if (chunkSize <= 0) {
    throw new Error("Chunk size must be greater than zero");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error("Chunk overlap must be >= 0 and < chunk size");
  }

  const chunks = [];

  for (const file of files) {
    const fileChunks = chunkText(
      file.content,
      chunkSize,
      overlap
    );

    fileChunks.forEach((chunk, chunkIndex) => {
      chunks.push({
        id: [
          repositoryContext.repositoryId || "repository",
          file.path,
          chunkIndex,
        ].join(":"),
        repositoryId: repositoryContext.repositoryId,
        owner: repositoryContext.owner,
        repo: repositoryContext.repo,
        branch: repositoryContext.branch,
        commitSha: repositoryContext.commitSha,
        path: file.path,
        sha: file.sha ?? null,
        chunkIndex,
        index: chunkIndex,
        start: chunk.start,
        end: chunk.end,
        size: chunk.content.length,
        content: chunk.content,
      });
    });
  }

  return chunks;
}

export {
  chunkRepositoryFiles,
  chunkText,
};
