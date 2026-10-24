import test from "node:test";
import assert from "node:assert/strict";
import { parseGitHubRepositoryUrl } from "../src/services/githubService.js";
test("parses a public GitHub repository URL", () => { assert.deepEqual(parseGitHubRepositoryUrl("https://github.com/facebook/react"), { owner: "facebook", repo: "react" }); });
test("supports .git suffix", () => { assert.deepEqual(parseGitHubRepositoryUrl("https://github.com/org/repo.git"), { owner: "org", repo: "repo" }); });
test("rejects non-GitHub hosts and non-HTTPS URLs", () => { assert.throws(() => parseGitHubRepositoryUrl("https://evil.example/org/repo")); assert.throws(() => parseGitHubRepositoryUrl("http://github.com/org/repo")); });
test("rejects malformed repository paths", () => { assert.throws(() => parseGitHubRepositoryUrl("https://github.com/org")); assert.throws(() => parseGitHubRepositoryUrl("")); });
