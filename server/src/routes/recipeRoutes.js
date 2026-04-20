import express from "express";
import {
	approveRecipe,
	createRecipe,
	deleteRecipe,
	getPendingRecipes,
	getRecipeByName,
	getRecipes
} from "../controllers/recipeController.js";
import { validateAdminAccess } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getRecipes);
router.post("/", createRecipe);

router.get("/admin/pending", validateAdminAccess, getPendingRecipes);
router.patch("/admin/:id/approve", validateAdminAccess, approveRecipe);
router.delete("/admin/:id", validateAdminAccess, deleteRecipe);

router.get("/:name", getRecipeByName);

export default router;
