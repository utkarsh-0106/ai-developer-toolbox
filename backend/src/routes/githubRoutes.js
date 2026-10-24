import express from "express";
import {
  getPublicRepositoryMetadata,
} from "../controllers/githubController.js";
import { indexPublicRepository, indexConnectedRepository } from "../controllers/repositoryController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/public/repository", getPublicRepositoryMetadata);

router.post(
  "/index",
  requireAuth,
  indexPublicRepository
);
router.post("/index-connected", requireAuth, indexConnectedRepository);

export default router;
