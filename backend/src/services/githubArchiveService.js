import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);

export async function extractRepositoryArchive(archiveBuffer) {
  if (!Buffer.isBuffer(archiveBuffer) || archiveBuffer.length === 0) {
    throw new Error("Repository archive is empty");
  }

  const tempDirectory = await mkdtemp(
    path.join(tmpdir(), "ai-toolbox-github-")
  );

  const archivePath = path.join(tempDirectory, "repository.tar.gz");

  try {
    await import("node:fs/promises").then(({ writeFile }) =>
      writeFile(archivePath, archiveBuffer)
    );

    await execFileAsync("tar", [
      "-xzf",
      archivePath,
      "-C",
      tempDirectory,
    ]);

    return {
      tempDirectory,
    };
  } catch (error) {
    await rm(tempDirectory, { recursive: true, force: true });
    throw new Error(
      `Failed to extract GitHub repository archive: ${
        error?.message || "Unknown error"
      }`
    );
  }
}
