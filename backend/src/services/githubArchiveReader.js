import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { filterRepositoryFiles } from "./githubFileFilter.js";

async function walkDirectory(directory, rootDirectory, results = []) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walkDirectory(fullPath, rootDirectory, results);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const relativePath = path
      .relative(rootDirectory, fullPath)
      .split(path.sep)
      .join("/");

    const fileStats = await stat(fullPath);

    results.push({
      path: relativePath,
      type: "blob",
      size: fileStats.size,
    });
  }

  return results;
}

export async function readRepositoryArchive(
  extractedDirectory,
  repositoryRootName
) {
  if (!extractedDirectory || !repositoryRootName) {
    throw new Error("Extracted repository directory is required");
  }

  const repositoryRoot = path.join(
    extractedDirectory,
    repositoryRootName
  );

  const tree = await walkDirectory(repositoryRoot, repositoryRoot);

  const selectedFiles = filterRepositoryFiles(tree);

  const files = [];

  for (const file of selectedFiles) {
    const filePath = path.join(repositoryRoot, file.path);
    const content = await readFile(filePath, "utf8");

    files.push({
      path: file.path,
      sha: null,
      size: file.size,
      content,
    });
  }

  return {
    candidates: tree.length,
    selected: selectedFiles.length,
    files,
  };
}
