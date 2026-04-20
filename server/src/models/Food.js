import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      enum: ["fruit", "vegetable", "grain", "protein", "dairy", "other"],
      default: "other"
    },
    per100g: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true },
      fiber: { type: Number, required: true },
      vitaminC: { type: Number, required: true },
      iron: { type: Number, required: true },
      calcium: { type: Number, required: true },
      potassium: { type: Number, required: true }
    },
    healthBenefits: { type: [String], default: [] }
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
