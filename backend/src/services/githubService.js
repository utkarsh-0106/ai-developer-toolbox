const GITHUB_API_BASE = "https://api.github.com";

export function parseGitHubRepositoryUrl(repositoryUrl) {
  if (!repositoryUrl || typeof repositoryUrl !== "string") {
    throw new Error("GitHub repository URL is required");
  }

  let url;

  try {
    url = new URL(repositoryUrl.trim());
  } catch {
    throw new Error("Invalid GitHub repository URL");
  }

  if (url.protocol !== "https:" || url.hostname !== "github.com") {
    throw new Error("URL must be a valid github.com repository URL");
  }

  const parts = url.pathname
    .split("/")
    .filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");

  if (!owner || !repo) {
    throw new Error("Invalid GitHub repository URL");
  }

  return { owner, repo };
}

export async function getPublicRepository(repositoryUrl) {
  const { owner, repo } = parseGitHubRepositoryUrl(repositoryUrl);

  const githubRepositoryUrl = `https://github.com/${owner}/${repo}`;

  const response = await fetch(githubRepositoryUrl, {
    headers: {
      "User-Agent": "AI-Developer-Toolbox",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub repository not found");
    }

    throw new Error("Failed to retrieve GitHub repository");
  }

  const html = await response.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);

  const title = titleMatch?.[1]
    ?.replace(/ · GitHub$/, "")
    ?.trim();

  const branchMatch =
    html.match(/"defaultBranch":"([^"]+)"/) ||
    html.match(/"default_branch":"([^"]+)"/);

  const defaultBranch = branchMatch?.[1] || "main";

  return {
    id: `${owner}/${repo}`,
    owner,
    name: repo,
    fullName: `${owner}/${repo}`,
    description: null,
    private: false,
    defaultBranch,
    language: null,
    htmlUrl: githubRepositoryUrl,
    title,
  };
}

export async function getPublicRepositoryTree(owner, repo, branch) {
  if (!owner || !repo || !branch) {
    throw new Error("Repository owner, name, and branch are required");
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "AI-Developer-Toolbox",
      },
    }
  );

  if (response.status === 404) {
    throw new Error("GitHub repository tree not found");
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error("GitHub API rate limit exceeded");
  }

  if (!response.ok) {
    throw new Error("Failed to retrieve GitHub repository tree");
  }

  const data = await response.json();

  return {
    sha: data.sha,
    truncated: Boolean(data.truncated),
    tree: Array.isArray(data.tree)
      ? data.tree.map((item) => ({
          path: item.path,
          mode: item.mode,
          type: item.type,
          sha: item.sha,
          size: item.size,
          url: item.url,
        }))
      : [],
  };
}

const FILE_FETCH_CONCURRENCY = 5;

async function getRepositoryBlob(owner, repo, sha) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/blobs/${encodeURIComponent(sha)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "AI-Developer-Toolbox",
      },
    }
  );

  if (response.status === 404) {
    throw new Error("GitHub file not found");
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error("GitHub API rate limit exceeded");
  }

  if (!response.ok) {
    throw new Error("Failed to retrieve GitHub file");
  }

  return response.json();
}

async function mapWithConcurrency(items, worker, concurrency) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] = await worker(items[index], index);
    }
  }

  const workers = Array.from(
    {
      length: Math.min(concurrency, items.length),
    },
    () => runWorker()
  );

  await Promise.all(workers);

  return results;
}

export async function getRepositoryFileContents(owner, repo, files) {
  if (!owner || !repo) {
    throw new Error("Repository owner and name are required");
  }

  if (!Array.isArray(files)) {
    throw new Error("Repository files must be an array");
  }

  const results = await mapWithConcurrency(
    files,
    async (file) => {
      if (!file?.path || !file?.sha) {
        return null;
      }

      try {
        const blob = await getRepositoryBlob(owner, repo, file.sha);

        if (blob.encoding !== "base64" || typeof blob.content !== "string") {
          return null;
        }

        const content = Buffer.from(blob.content, "base64").toString("utf8");

        return {
          path: file.path,
          sha: file.sha,
          size: file.size ?? blob.size ?? Buffer.byteLength(content, "utf8"),
          content,
        };
      } catch (error) {
        console.warn(
          `Skipping repository file ${file.path}:`,
          error?.message || error
        );

        return null;
      }
    },
    FILE_FETCH_CONCURRENCY
  );

  return results.filter(Boolean);
}


export async function downloadPublicRepositoryArchive(owner, repo, branch) {
  if (!owner || !repo || !branch) {
    throw new Error("Repository owner, name, and branch are required");
  }

  const archiveUrl =
    `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
    `/archive/refs/heads/${encodeURIComponent(branch)}.tar.gz`;

  const response = await fetch(archiveUrl, {
    headers: {
      "User-Agent": "AI-Developer-Toolbox",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to download GitHub repository archive");
  }

  const archiveBuffer = Buffer.from(await response.arrayBuffer());
  const etag = response.headers.get("etag");

  const commitsUrl =
    `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}` +
    `/commits/${encodeURIComponent(branch)}`;

  const commitsResponse = await fetch(commitsUrl, {
    headers: {
      "User-Agent": "AI-Developer-Toolbox",
    },
  });

  if (!commitsResponse.ok) {
    throw new Error("Failed to retrieve GitHub repository commit");
  }

  const commitsHtml = await commitsResponse.text();
  const commitSha =
    commitsHtml.match(/[0-9a-f]{40}/)?.[0] || null;

  if (!commitSha) {
    throw new Error("GitHub repository commit SHA could not be determined");
  }

  return {
    archiveBuffer,
    archiveUrl,
    etag,
    commitSha,
  };
}
