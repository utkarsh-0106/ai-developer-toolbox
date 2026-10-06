import express from "express";
import {
  getPublicRepositoryMetadata,
} from "../controllers/githubController.js";
import { indexPublicRepository } from "../controllers/repositoryController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/public/repository", getPublicRepositoryMetadata);

router.post(
  "/index",
  requireAuth,
  indexPublicRepository
);

export default router;
