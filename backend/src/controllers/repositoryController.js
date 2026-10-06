import { ingestPublicRepository } from "../services/githubIngestionService.js";
import { saveRepositoryIndex } from "../services/repositoryService.js";

async function indexPublicRepository(req, res) {
  try {
    const { repositoryUrl } = req.body;

    if (!repositoryUrl) {
      return res.status(400).json({
        message: "repositoryUrl is required",
      });
    }

    const ingestionResult = await ingestPublicRepository(repositoryUrl);

    const savedResult = await saveRepositoryIndex(
      req.user._id,
      ingestionResult
    );

    return res.status(200).json({
      message: "Repository indexed successfully",
      repository: {
        id: savedResult.repository._id,
        githubId: savedResult.repository.githubId,
        fullName: savedResult.repository.fullName,
        branch: savedResult.repository.defaultBranch,
        commitSha: savedResult.repository.lastIndexedCommitSha,
        status: savedResult.repository.indexingStatus,
      },
      chunkCount: savedResult.chunkCount,
    });
  } catch (error) {
    console.error("Repository indexing error:", error);

    const message = error.message || "Failed to index repository";

    if (message === "GitHub repository not found") {
      return res.status(404).json({ message });
    }

    if (message === "GitHub API rate limit exceeded") {
      return res.status(429).json({ message });
    }

    if (
      message === "Invalid GitHub repository URL" ||
      message === "Repository URL is required"
    ) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
}

export {
  indexPublicRepository,
};
