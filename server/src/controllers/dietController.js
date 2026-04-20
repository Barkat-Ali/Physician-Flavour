import mongoose from "mongoose";
import Food from "../models/Food.js";
import { fallbackFoods } from "../data/foods.js";

const round = (value) => Math.round(value * 10) / 10;

const scaleNutrition = (per100g, serving) => {
  const ratio = serving / 100;

  return {
    calories: round(per100g.calories * ratio),
    protein: round(per100g.protein * ratio),
    carbs: round(per100g.carbs * ratio),
    fats: round(per100g.fats * ratio),
    fiber: round(per100g.fiber * ratio),
    vitaminC: round(per100g.vitaminC * ratio),
    iron: round(per100g.iron * ratio),
    calcium: round(per100g.calcium * ratio),
    potassium: round(per100g.potassium * ratio)
  };
};

const resolveFoods = async () => {
  if (mongoose.connection.readyState === 1) {
    const dbFoods = await Food.find({}).lean();
    if (dbFoods.length > 0) {
      return dbFoods;
    }
  }

  return fallbackFoods;
};

export const getDietAnalysis = async (req, res, next) => {
  try {
    const foods = await resolveFoods();
    const query = (req.query.query || "").trim().toLowerCase();
    const serving = Number(req.query.serving || 100);

    if (!query) {
      res.status(400);
      throw new Error("Please provide a food query.");
    }

    if (Number.isNaN(serving) || serving <= 0) {
      res.status(400);
      throw new Error("Serving must be a positive number in grams.");
    }

    const match = foods.find((food) => food.name.toLowerCase().includes(query));

    if (!match) {
      return res.status(404).json({
        message: "No food matched your query.",
        suggestions: foods.slice(0, 6).map((item) => item.name)
      });
    }

    const nutrients = scaleNutrition(match.per100g, serving);

    return res.json({
      food: match.name,
      category: match.category,
      serving,
      nutrients,
      healthBenefits: match.healthBenefits
    });
  } catch (error) {
    next(error);
  }
};

export const getDietSuggestions = async (req, res, next) => {
  try {
    const foods = await resolveFoods();
    const query = (req.query.query || "").trim().toLowerCase();

    const suggestions = foods
      .filter((food) => food.name.toLowerCase().includes(query))
      .slice(0, 8)
      .map((food) => ({
        name: food.name,
        category: food.category
      }));

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};
