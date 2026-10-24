import crypto from "node:crypto";
import { env } from "../config/env.js";
import { GitHubConnection, GitHubOAuthState } from "../models/Integration.js";
import { encryptSecret, decryptSecret } from "../services/secretCrypto.js";
const api = "https://api.github.com";
const headers = (token) => ({ Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "AI-Developer-Toolbox" });
export async function githubStart(req, res) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CALLBACK_URL || !env.GITHUB_CLIENT_SECRET || !env.INTEGRATION_ENCRYPTION_KEY) return res.status(503).json({ message: "GitHub OAuth is not configured on the server" });
  const state = crypto.randomBytes(32).toString("hex");
  await GitHubOAuthState.create({ stateHash: crypto.createHash("sha256").update(state).digest("hex"), userId: req.user._id, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  const url = new URL("https://github.com/login/oauth/authorize"); url.searchParams.set("client_id", env.GITHUB_CLIENT_ID); url.searchParams.set("redirect_uri", env.GITHUB_CALLBACK_URL); url.searchParams.set("scope", "read:user repo"); url.searchParams.set("state", state);
  res.json({ url: url.toString() });
}
export async function githubCallback(req, res) {
  const { code, state } = req.query;
  if (typeof state !== "string" || typeof code !== "string") return res.status(400).send("GitHub authorization was incomplete. Return to the Toolbox and try again.");
  const stateHash = crypto.createHash("sha256").update(state).digest("hex");
  const record = await GitHubOAuthState.findOneAndDelete({ stateHash, expiresAt: { $gt: new Date() } });
  if (!record) return res.status(400).send("GitHub authorization state is invalid or expired. Return to the Toolbox and try again.");
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: env.GITHUB_CALLBACK_URL }) });
    const tokenData = await tokenResponse.json(); if (!tokenResponse.ok || !tokenData.access_token) throw new Error("GitHub token exchange failed");
    const userResponse = await fetch(`${api}/user`, { headers: headers(tokenData.access_token) }); if (!userResponse.ok) throw new Error("Could not verify GitHub account"); const githubUser = await userResponse.json();
    await GitHubConnection.findOneAndUpdate({ userId: record.userId }, { userId: record.userId, githubUserId: String(githubUser.id), login: githubUser.login, encryptedToken: encryptSecret(tokenData.access_token) }, { upsert: true, new: true, runValidators: true });
    const frontend = env.FRONTEND_ORIGIN?.split(",")[0] || "http://localhost:5173";
    return res.redirect(`${frontend.replace(/\/$/, "")}/?github=connected`);
  } catch (error) { console.error("GitHub OAuth callback failed:", error.message); return res.status(400).send("GitHub connection failed. Return to the Toolbox and retry."); }
}
export async function githubStatus(req, res) { const c = await GitHubConnection.findOne({ userId: req.user._id }).select("login githubUserId createdAt").lean(); res.json({ connected: Boolean(c), account: c ? { login: c.login, connectedAt: c.createdAt } : null }); }
export async function githubDisconnect(req, res) { await GitHubConnection.deleteOne({ userId: req.user._id }); res.json({ connected: false }); }
export async function githubRepositories(req, res) {
  const connection = await GitHubConnection.findOne({ userId: req.user._id });
  if (!connection) {
    return res.status(409).json({ message: "Connect GitHub first" });
  }

  try {
    const token = decryptSecret(connection.encryptedToken);
    const allRepositories = [];
    const seenIds = new Set();
    const perPage = 100;
    let page = 1;

    while (true) {
      const url = `${api}/user/repos?sort=updated&per_page=${perPage}&visibility=all&page=${page}`;
      const response = await fetch(url, { headers: headers(token) });

      if (response.status === 401) {
        return res.status(401).json({
          message: "GitHub authorization expired. Disconnect and reconnect GitHub.",
        });
      }

      if (response.status === 403 || response.status === 429) {
        return res.status(502).json({
          message: "GitHub denied repository listing or its API rate limit was reached. Try again later.",
        });
      }

      if (!response.ok) {
        console.error("GitHub repository listing failed on page", page, "with status", response.status);
        return res.status(502).json({
          message: "Unable to retrieve all GitHub repositories. Try again later.",
        });
      }

      const repositories = await response.json();
      if (!Array.isArray(repositories)) {
        throw new Error("Unexpected GitHub repository listing response");
      }

      for (const repository of repositories) {
        if (repository?.id == null || seenIds.has(repository.id)) continue;
        seenIds.add(repository.id);
        allRepositories.push(repository);
      }

      if (repositories.length < perPage) break;
      page += 1;
    }

    return res.json({
      repositories: allRepositories.map(
        ({ id, full_name, private: isPrivate, html_url, default_branch, description, language }) => ({
          id,
          fullName: full_name,
          private: isPrivate,
          url: html_url,
          defaultBranch: default_branch,
          description,
          language,
        })
      ),
    });
  } catch (error) {
    console.error("GitHub repository listing failed:", error?.message || "Unknown error");
    return res.status(502).json({ message: "Unable to retrieve GitHub repositories" });
  }
}
