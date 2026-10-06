import {
  getPublicRepository,
  downloadPublicRepositoryArchive,
} from "./githubService.js";

import { extractRepositoryArchive } from "./githubArchiveService.js";
import { readRepositoryArchive } from "./githubArchiveReader.js";
import { chunkRepositoryFiles } from "./githubChunker.js";
import { rm, readdir } from "node:fs/promises";

async function ingestPublicRepository(repositoryUrl) {
  const repository = await getPublicRepository(repositoryUrl);

  const archiveResult = await downloadPublicRepositoryArchive(
    repository.owner,
    repository.name,
    repository.defaultBranch
  );

  const { tempDirectory } = await extractRepositoryArchive(
    archiveResult.archiveBuffer
  );

  try {
    const entries = await readdir(tempDirectory);

    const repositoryRootName = entries.find(
      (entry) => entry !== "repository.tar.gz"
    );

    if (!repositoryRootName) {
      throw new Error("GitHub repository archive is empty");
    }

    const filesResult = await readRepositoryArchive(
      tempDirectory,
      repositoryRootName
    );

    const chunks = chunkRepositoryFiles(
      filesResult.files,
      undefined,
      undefined,
      {
        repositoryId: String(repository.id),
        owner: repository.owner,
        repo: repository.name,
        branch: repository.defaultBranch,
        commitSha: archiveResult.commitSha,
      }
    );

    return {
      repository,
      tree: {
        sha: archiveResult.commitSha,
        truncated: false,
        totalEntries: filesResult.candidates,
      },
      files: {
        candidates: filesResult.candidates,
        selected: filesResult.selected,
        fetched: filesResult.files.length,
      },
      chunks,
      archive: {
        etag: archiveResult.etag,
      },
    };
  } finally {
    await rm(tempDirectory, {
      recursive: true,
      force: true,
    });
  }
}

export {
  ingestPublicRepository,
};
