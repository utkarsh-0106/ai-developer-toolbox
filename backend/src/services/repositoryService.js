import Repository from "../models/Repository.js";
import RepositoryChunk from "../models/RepositoryChunk.js";

async function saveRepositoryIndex(userId, ingestionResult) {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!ingestionResult?.repository) {
    throw new Error("Repository ingestion result is required");
  }

  if (!ingestionResult?.tree?.sha) {
    throw new Error("Repository commit SHA is required");
  }

  if (!Array.isArray(ingestionResult?.chunks)) {
    throw new Error("Repository chunks must be an array");
  }

  const { repository, tree, chunks } = ingestionResult;

  const savedRepository = await Repository.findOneAndUpdate(
    {
      userId,
      githubId: String(repository.id),
    },
    {
      $set: {
        owner: repository.owner,
        name: repository.name,
        fullName: repository.fullName,
        url: repository.htmlUrl,
        defaultBranch: repository.defaultBranch,
        description: repository.description,
        language: repository.language,
        lastIndexedCommitSha: tree.sha,
        lastIndexedAt: new Date(),
        indexingStatus: "ready",
        indexingError: null,
      },
      $setOnInsert: {
        userId,
        githubId: String(repository.id),
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }
  );

  await RepositoryChunk.deleteMany({
    userId,
    repositoryId: savedRepository._id,
    commitSha: tree.sha,
  });

  if (chunks.length > 0) {
    const documents = chunks.map((chunk) => ({
      userId,
      repositoryId: savedRepository._id,
      githubRepositoryId: String(repository.id),
      commitSha: tree.sha,
      owner: chunk.owner,
      repo: chunk.repo,
      branch: chunk.branch,
      path: chunk.path,
      fileSha: chunk.sha,
      chunkIndex: chunk.chunkIndex,
      start: chunk.start,
      end: chunk.end,
      size: chunk.size,
      content: chunk.content,
    }));

    await RepositoryChunk.insertMany(documents);
  }

  return {
    repository: savedRepository,
    chunkCount: chunks.length,
  };
}

export {
  saveRepositoryIndex,
};
