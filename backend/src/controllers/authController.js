import { verifyGoogleCredential } from "../services/authService.js";

export const handleGoogleAuth = async (req, res) => {
  try {
    const { credential } = req.body || {};

    if (!credential) {
      return res.status(400).json({
        error: "Missing Google credential",
      });
    }

    const result = await verifyGoogleCredential(credential);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Auth error:");

    if (error?.code === "INVALID_GOOGLE_TOKEN") {
      return res.status(401).json({
        error: "Invalid Google token",
      });
    }

    return res.status(500).json({
      error: "Authentication failed",
    });
  }
};
