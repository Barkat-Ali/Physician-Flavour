import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["main", "dessert", "drink", "salad"],
      default: "main"
    },
    dietTags: { type: [String], default: [] },
    calories: { type: Number, required: true },
    prepTimeMinutes: { type: Number, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    imageUrl: { type: String, default: "" },
    description: { type: String, required: true },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
