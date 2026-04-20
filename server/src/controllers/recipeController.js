import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import { fallbackRecipes } from "../data/recipes.js";

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const toNumber = (value) => Number(value || 0);

const resolveRecipes = async () => {
  return fallbackRecipes.map((recipe) => ({ ...recipe, approved: true }));
};

const resolveSearchableRecipes = async () => {
  const fallback = await resolveRecipes();

  if (mongoose.connection.readyState !== 1) {
    return fallback;
  }

  const dbRecipes = await Recipe.find({ approved: true }).lean();
  return [...fallback, ...dbRecipes];
};

const resolvePendingRecipes = async () => {
  if (mongoose.connection.readyState !== 1) {
    return [];
  }

  return Recipe.find({ approved: false }).sort({ createdAt: -1 }).lean();
};

export const getRecipes = async (req, res, next) => {
  try {
    const { search = "", category = "", tag = "" } = req.query;

    const normalizedSearch = search.trim().toLowerCase();
    const normalizedCategory = category.trim().toLowerCase();
    const normalizedTag = tag.trim().toLowerCase();
    const recipes = await resolveSearchableRecipes();

    const filtered = recipes.filter((recipe) => {
      const matchesSearch =
        !normalizedSearch ||
        recipe.name.toLowerCase().includes(normalizedSearch) ||
        recipe.description.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !normalizedCategory || recipe.category.toLowerCase() === normalizedCategory;

      const matchesTag =
        !normalizedTag ||
        toArray(recipe.dietTags).some((dietTag) =>
          dietTag.toLowerCase().includes(normalizedTag)
        );

      return matchesSearch && matchesCategory && matchesTag;
    });

    res.json(filtered);
  } catch (error) {
    next(error);
  }
};

export const getRecipeByName = async (req, res, next) => {
  try {
    const recipeName = req.params.name.toLowerCase();
    const recipes = await resolveRecipes();

    const recipe = recipes.find(
      (item) => item.name.toLowerCase().replaceAll(" ", "-") === recipeName
    );

    if (!recipe) {
      res.status(404);
      throw new Error("Recipe not found.");
    }

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const recipe = await Recipe.create({
      name: req.body.name,
      category: req.body.category || "main",
      dietTags: toArray(req.body.dietTags),
      calories: toNumber(req.body.calories),
      prepTimeMinutes: toNumber(req.body.prepTimeMinutes || req.body.prepTime),
      ingredients: toArray(req.body.ingredients),
      steps: toArray(req.body.steps),
      imageUrl: req.body.imageUrl || "",
      description: req.body.description,
      approved: false
    });

    res.status(201).json({
      message: "Recipe submitted for review.",
      recipe
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingRecipes = async (req, res, next) => {
  try {
    const pendingRecipes = await resolvePendingRecipes();
    res.json(pendingRecipes);
  } catch (error) {
    next(error);
  }
};

export const approveRecipe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    ).lean();

    if (!recipe) {
      res.status(404);
      throw new Error("Recipe not found.");
    }

    res.json({ message: "Recipe approved.", recipe });
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503);
      throw new Error("Database connection is not available.");
    }

    const deleted = await Recipe.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      res.status(404);
      throw new Error("Recipe not found.");
    }

    res.json({ message: "Recipe deleted." });
  } catch (error) {
    next(error);
  }
};
