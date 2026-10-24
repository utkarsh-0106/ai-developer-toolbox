import {
  getPublicRepository,
  downloadPublicRepositoryArchive,
  getPublicRepositoryTree,
  getRepositoryFileContents,
  getRepositoryCommitSha,
} from "./githubService.js";
import { extractRepositoryArchive } from "./githubArchiveService.js";
import { readRepositoryArchive } from "./githubArchiveReader.js";
import { filterRepositoryFiles } from "./githubFileFilter.js";
import { chunkRepositoryFiles } from "./githubChunker.js";
import { rm, readdir } from "node:fs/promises";

async function ingestPublicRepository(repositoryUrl, token = null) {
  const repository = await getPublicRepository(repositoryUrl, token);
  let filesResult;
  let commitSha;
  let treeSha = null;
  let etag = null;
  let totalEntries;

  if (token) {
    const [tree, latestCommitSha] = await Promise.all([
      getPublicRepositoryTree(
        repository.owner, repository.name, repository.defaultBranch, token
      ),
      getRepositoryCommitSha(
        repository.owner, repository.name, repository.defaultBranch, token
      ),
    ]);

    const candidates = tree.tree.filter((item) => item.type === "blob");
    const selectedFiles = filterRepositoryFiles(candidates);
    const fetchedFiles = await getRepositoryFileContents(
      repository.owner, repository.name, selectedFiles, token
    );

    if (selectedFiles.length && !fetchedFiles.length) {
      throw new Error("Unable to retrieve repository files using the connected GitHub account");
    }

    filesResult = {
      candidates: candidates.length,
      selected: selectedFiles.length,
      files: fetchedFiles,
    };
    commitSha = latestCommitSha;
    treeSha = tree.sha;
    totalEntries = tree.tree.length;
  } else {
    const archiveResult = await downloadPublicRepositoryArchive(
      repository.owner, repository.name, repository.defaultBranch
    );
    const { tempDirectory } = await extractRepositoryArchive(archiveResult.archiveBuffer);

    try {
      const entries = await readdir(tempDirectory);
      const repositoryRootName = entries.find((entry) => entry !== "repository.tar.gz");
      if (!repositoryRootName) throw new Error("GitHub repository archive is empty");

      filesResult = await readRepositoryArchive(tempDirectory, repositoryRootName);
      commitSha = archiveResult.commitSha;
      etag = archiveResult.etag;
      totalEntries = filesResult.candidates;
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  }

  const chunks = chunkRepositoryFiles(filesResult.files, undefined, undefined, {
    repositoryId: String(repository.id),
    owner: repository.owner,
    repo: repository.name,
    branch: repository.defaultBranch,
    commitSha,
  });

  return {
    repository,
    tree: { sha: treeSha || commitSha, truncated: false, totalEntries },
    files: {
      candidates: filesResult.candidates,
      selected: filesResult.selected,
      fetched: filesResult.files.length,
    },
    chunks,
    archive: { etag },
  };
}

export { ingestPublicRepository };
