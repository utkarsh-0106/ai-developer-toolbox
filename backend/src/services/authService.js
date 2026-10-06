import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    const error = new Error("Missing Google credential");
    error.code = "MISSING_GOOGLE_CREDENTIAL";
    throw error;
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      const error = new Error("Invalid Google credential");
      error.code = "INVALID_GOOGLE_TOKEN";
      throw error;
    }

    const user = await User.findOneAndUpdate(
      { googleId: payload.sub },
      {
        googleId: payload.sub,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        picture: payload.picture || "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    const token = jwt.sign(
      {
        googleId: user.googleId,
      },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      token,
      user: {
        id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    };
  } catch (error) {
    if (
      error?.code === "MISSING_GOOGLE_CREDENTIAL" ||
      error?.code === "INVALID_GOOGLE_TOKEN"
    ) {
      throw error;
    }

    const authError = new Error("Invalid Google credential");
    authError.code = "INVALID_GOOGLE_TOKEN";
    throw authError;
  }
};
