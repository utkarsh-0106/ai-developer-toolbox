import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import { askRepositoryQuestion } from "../controllers/repositoryQaController.js";

const router = express.Router();

router.post("/qa", requireAuth, askRepositoryQuestion);

export default router;
