import mongoose from "mongoose";
const githubConnectionSchema = new mongoose.Schema({ userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true }, githubUserId: { type: String, required: true }, login: { type: String, required: true }, encryptedToken: { type: String, required: true } }, { timestamps: true });
export const GitHubConnection = mongoose.model("GitHubConnection", githubConnectionSchema);

const oauthStateSchema = new mongoose.Schema({ stateHash: { type: String, required: true, unique: true }, userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, expiresAt: { type: Date, required: true, expires: 0 } });
export const GitHubOAuthState = mongoose.model("GitHubOAuthState", oauthStateSchema);
