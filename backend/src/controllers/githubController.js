import { getPublicRepository } from "../services/githubService.js";

export const getPublicRepositoryMetadata = async (req, res) => {
  try {
    const { repositoryUrl } = req.body || {};

    if (!repositoryUrl || !repositoryUrl.trim()) {
      return res.status(400).json({
        error: "GitHub repository URL is required",
      });
    }

    const repository = await getPublicRepository(repositoryUrl);

    return res.status(200).json({
      repository,
    });
  } catch (error) {
    const message = error?.message || "Failed to retrieve repository";

    if (message === "Invalid GitHub repository URL" || message === "URL must be a valid github.com repository URL") {
      return res.status(400).json({ error: message });
    }

    if (message === "GitHub repository not found") {
      return res.status(404).json({ error: message });
    }

    if (message === "GitHub API rate limit exceeded") {
      return res.status(429).json({ error: message });
    }

    console.error("GitHub repository error:", error);

    return res.status(500).json({
      error: "Failed to retrieve GitHub repository",
    });
  }
};
