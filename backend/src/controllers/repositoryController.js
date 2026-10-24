import { ingestPublicRepository } from "../services/githubIngestionService.js";
import { saveRepositoryIndex } from "../services/repositoryService.js";
import { GitHubConnection } from "../models/Integration.js";
import { decryptSecret } from "../services/secretCrypto.js";

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


export async function indexConnectedRepository(req, res) {
  try {
    const { repositoryUrl } = req.body || {};
    if (typeof repositoryUrl !== "string" || !repositoryUrl.trim()) return res.status(400).json({ message: "repositoryUrl is required" });
    const connection = await GitHubConnection.findOne({ userId: req.user._id });
    if (!connection) return res.status(409).json({ message: "Connect GitHub before indexing private repositories" });
    const token = decryptSecret(connection.encryptedToken);
    const ingestionResult = await ingestPublicRepository(repositoryUrl.trim(), token);
    if (ingestionResult.repository.private && !connection.githubUserId) return res.status(403).json({ message: "GitHub account is not authorized" });
    const savedResult = await saveRepositoryIndex(req.user._id, ingestionResult);
    return res.status(200).json({ message: "Connected repository indexed successfully", repository: { id: savedResult.repository._id, githubId: savedResult.repository.githubId, fullName: savedResult.repository.fullName, branch: savedResult.repository.defaultBranch, commitSha: savedResult.repository.lastIndexedCommitSha, status: savedResult.repository.indexingStatus, private: Boolean(ingestionResult.repository.private) }, chunkCount: savedResult.chunkCount });
  } catch (error) {
    const message = error?.message || "Failed to index connected repository";

    // Safe diagnostics: never log tokens, request headers, or repository contents.
    console.error("Connected repository indexing failed:", {
      name: error?.name,
      message,
      status: error?.status,
      contentType: error?.contentType,
    });

    const status = /not found|not accessible/i.test(message) ? 404 : /authorization|rate limit/i.test(message) ? 403 : /Invalid GitHub repository URL|URL must be/i.test(message) ? 400 : 502;
    return res.status(status).json({ message: status === 502 ? "Unable to index repository. Check GitHub access and try again." : message });
  }
}
