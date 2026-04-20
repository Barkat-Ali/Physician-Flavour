import express from "express";
import { getDietAnalysis, getDietSuggestions } from "../controllers/dietController.js";

const router = express.Router();

router.get("/", getDietAnalysis);
router.get("/suggestions", getDietSuggestions);

export default router;
