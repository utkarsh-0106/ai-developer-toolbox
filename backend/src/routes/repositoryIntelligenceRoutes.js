import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
  repositoryTree, repositoryFile, repositoryAnalyze, repositoryAgent,
  codeReview, debugging, securityScan, testGeneration, diffReview,
  search, telemetry, evaluate,
} from "../controllers/repositoryIntelligenceController.js";

const router = express.Router();
router.use(requireAuth);
router.get("/:repositoryId/tree", repositoryTree);
router.get("/:repositoryId/file", repositoryFile);
router.post("/:repositoryId/analyze", repositoryAnalyze);
router.post("/:repositoryId/agent", repositoryAgent);
router.post("/:repositoryId/review", codeReview);
router.post("/:repositoryId/debug", debugging);
router.post("/:repositoryId/security", securityScan);
router.post("/:repositoryId/tests", testGeneration);
router.post("/:repositoryId/diff-review", diffReview);
router.post("/:repositoryId/search", search);
router.get("/:repositoryId/telemetry", telemetry);
router.post("/:repositoryId/evaluate", evaluate);
export default router;
