import express from "express";
import { handleGoogleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/google", handleGoogleAuth);

export default router;
