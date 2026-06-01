import express from "express";

import {
  generateResponse,
  getHistory,
  deleteHistoryItem,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", generateResponse);
router.get("/history", getHistory);
router.delete("/history/:id", deleteHistoryItem);

export default router;