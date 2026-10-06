import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!decoded?.googleId) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const user = await User.findOne({
      googleId: decoded.googleId,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

export default requireAuth;
