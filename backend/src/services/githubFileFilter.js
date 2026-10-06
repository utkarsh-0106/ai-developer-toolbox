const SUPPORTED_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".cc",
  ".cxx",
  ".c",
  ".h",
  ".hpp",
  ".go",
  ".rs",
  ".php",
  ".rb",
  ".swift",
  ".kt",
  ".kts",
  ".html",
  ".css",
  ".scss",
  ".sass",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".xml",
  ".md",
  ".mdx",
]);

const SPECIAL_FILENAMES = new Set([
  "Dockerfile",
  "Makefile",
]);

const IGNORED_DIRECTORIES = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  "vendor",
  "target",
  "out",
  ".cache",
]);

const IGNORED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".bmp",
  ".tiff",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".mp3",
  ".wav",
  ".flac",
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",
  ".pdf",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".bin",
]);

const MAX_FILE_SIZE = 500 * 1024;
const MAX_FILES = 300;
const MAX_TOTAL_SIZE = 20 * 1024 * 1024;

const PRIORITY_DIRECTORIES = [
  "src/",
  "app/",
  "lib/",
  "server/",
  "api/",
  "packages/",
];

const PRIORITY_FILENAMES = new Set([
  "README",
  "README.md",
  "README.mdx",
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "Cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "Dockerfile",
]);

function getExtension(filePath) {
  const fileName = filePath.split("/").pop() || "";
  const lastDot = fileName.lastIndexOf(".");

  if (lastDot === -1) {
    return "";
  }

  return fileName.slice(lastDot).toLowerCase();
}

function isIgnoredDirectory(filePath) {
  const parts = filePath.split("/");

  return parts.some((part) => IGNORED_DIRECTORIES.has(part));
}

export function shouldIndexFile(file) {
  if (!file || file.type !== "blob" || !file.path) {
    return false;
  }

  if (isIgnoredDirectory(file.path)) {
    return false;
  }

  if (typeof file.size === "number" && file.size > MAX_FILE_SIZE) {
    return false;
  }

  const fileName = file.path.split("/").pop() || "";
  const extension = getExtension(file.path);

  if (SPECIAL_FILENAMES.has(fileName)) {
    return true;
  }

  if (IGNORED_EXTENSIONS.has(extension)) {
    return false;
  }

  return SUPPORTED_EXTENSIONS.has(extension);
}

function getFilePriority(file) {
  const fileName = file.path.split("/").pop() || "";
  const isRootLevel = !file.path.includes("/");

  if (isRootLevel && PRIORITY_FILENAMES.has(fileName)) {
    return 0;
  }

  if (PRIORITY_DIRECTORIES.some((directory) => file.path.startsWith(directory))) {
    return 1;
  }

  if (isRootLevel) {
    return 2;
  }

  return 3;
}

export function filterRepositoryFiles(tree) {
  if (!Array.isArray(tree)) {
    return [];
  }

  const candidates = tree
    .filter(shouldIndexFile)
    .sort((a, b) => {
      const priorityDifference =
        getFilePriority(a) - getFilePriority(b);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return a.path.localeCompare(b.path);
    });

  const selected = [];
  let totalSize = 0;

  for (const file of candidates) {
    const fileSize = typeof file.size === "number"
      ? file.size
      : 0;

    if (selected.length >= MAX_FILES) {
      break;
    }

    if (totalSize + fileSize > MAX_TOTAL_SIZE) {
      continue;
    }

    selected.push(file);
    totalSize += fileSize;
  }

  return selected;
}

export {
  MAX_FILE_SIZE,
  MAX_FILES,
  MAX_TOTAL_SIZE,
  PRIORITY_DIRECTORIES,
  PRIORITY_FILENAMES,
  SUPPORTED_EXTENSIONS,
  SPECIAL_FILENAMES,
  IGNORED_DIRECTORIES,
  IGNORED_EXTENSIONS,
};
