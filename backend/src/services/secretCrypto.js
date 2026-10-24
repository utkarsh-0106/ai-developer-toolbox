import crypto from "node:crypto";
import { env } from "../config/env.js";
function key() {
  if (!env.INTEGRATION_ENCRYPTION_KEY || Buffer.from(env.INTEGRATION_ENCRYPTION_KEY, "hex").length !== 32) throw new Error("INTEGRATION_ENCRYPTION_KEY must be a 32-byte hex key");
  return Buffer.from(env.INTEGRATION_ENCRYPTION_KEY, "hex");
}
export function encryptSecret(value) {
  const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}
export function decryptSecret(value) {
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv); decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
