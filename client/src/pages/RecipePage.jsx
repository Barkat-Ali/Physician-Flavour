import { useEffect, useState } from "react";
import { fetchRecipes, submitRecipe } from "../services/api";

const categories = ["", "main", "salad", "dessert", "drink"];

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/\r?\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean);
};

const prettifyCategory = (value) => {
  const text = String(value || "").trim();
  if (!text) {
    return "Uncategorized";
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

function RecipePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareForm, setShowShareForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "main",
    description: "",
    ingredients: "",
    steps: "",
    prepTime: "",
    calories: "",
    dietTags: ""
  });
  const [shareSuccess, setShareSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const loadRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchRecipes({ search, category, tag });
        if (active) {
          setRecipes(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRecipes();

    return () => {
      active = false;
    };
  }, [search, category, tag]);

  const handleShareSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.description) {
      setError("Recipe name and description are required");
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      ingredients: formData.ingredients,
      steps: formData.steps,
      prepTimeMinutes: formData.prepTime,
      calories: formData.calories,
      dietTags: formData.dietTags
    };

    submitRecipe(payload)
      .then((response) => {
        setShareSuccess(response.message || "Thank you for sharing your recipe. It is waiting for admin approval.");
        setFormData({
          name: "",
          category: "main",
          description: "",
          ingredients: "",
          steps: "",
          prepTime: "",
          calories: "",
          dietTags: ""
        });
        setShowShareForm(false);
      })
      .catch((requestError) => setError(requestError.message));
  };

  return (
    <div className="recipe-page" style={{ backgroundColor: "#f5f5dc", padding: "20px", minHeight: "100vh" }}>
      <h1 style={{ color: "rgb(32, 66, 44)", textShadow: "none", margin: "20px 0", fontWeight: 800, letterSpacing: "0.02em" }}>Recipe Studio</h1>
      <p style={{ margin: "20px" }}>
        Explore favorite meals, desserts, drinks, and salads with nutrition-aware filters. Search by name, share your own recipes!
      </p>

      <div className="recipe-filters" style={{ margin: "20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", boxSizing: "border-box" }}
          placeholder="Search recipes"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", boxSizing: "border-box" }}
        >
          {categories.map((item) => (
            <option key={item || "all"} value={item}>
              {item || "All categories"}
            </option>
          ))}
        </select>

        <input
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", boxSizing: "border-box" }}
          placeholder="Diet tag (example: high-protein)"
        />
      </div>

      <div style={{ margin: "20px", textAlign: "center" }}>
        <button
          onClick={() => setShowShareForm(!showShareForm)}
          style={{
            backgroundColor: "rgb(128, 216, 55)",
            color: "white",
            padding: "12px 25px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {showShareForm ? "Cancel" : "+ Share Your Recipe"}
        </button>
      </div>

      {showShareForm && (
        <div className="recipe-share-panel" style={{
          margin: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "2px solid rgb(128, 216, 55)"
        }}>
          <h2 style={{ color: "rgb(32, 66, 44)", textShadow: "none", marginBottom: "15px", fontWeight: 800, letterSpacing: "0.01em" }}>Share Your Recipe</h2>
          <form className="recipe-share-form" onSubmit={handleShareSubmit} style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <input
              className="recipe-share-field recipe-share-full"
              placeholder="Recipe Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", gridColumn: "1 / -1", minWidth: 0, width: "100%" }}
              required
            />
            <textarea
              className="recipe-share-field recipe-share-full"
              placeholder="Recipe Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", gridColumn: "1 / -1", minHeight: "80px", minWidth: 0, width: "100%" }}
              required
            />
            <select
              className="recipe-share-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minWidth: 0, width: "100%" }}
            >
              <option value="main">Main Dish</option>
              <option value="salad">Salad</option>
              <option value="dessert">Dessert</option>
              <option value="drink">Drink</option>
            </select>
            <input
              className="recipe-share-field"
              placeholder="Prep Time (minutes)"
              type="number"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minWidth: 0, width: "100%" }}
            />
            <textarea
              className="recipe-share-field recipe-share-full"
              placeholder="Ingredients (one per line)"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", gridColumn: "1 / -1", minHeight: "80px", minWidth: 0, width: "100%" }}
            />
            <textarea
              className="recipe-share-field recipe-share-full"
              placeholder="Steps (one per line)"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", gridColumn: "1 / -1", minHeight: "80px", minWidth: 0, width: "100%" }}
            />
            <input
              className="recipe-share-field"
              placeholder="Calories (approx)"
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minWidth: 0, width: "100%" }}
            />
            <input
              className="recipe-share-field"
              placeholder="Diet Tags (comma-separated, e.g., vegan, high-protein)"
              value={formData.dietTags}
              onChange={(e) => setFormData({ ...formData, dietTags: e.target.value })}
              style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px", minWidth: 0, width: "100%" }}
            />
            <button
              type="submit"
              className="recipe-share-submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 20px",
                borderRadius: "6px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                gridColumn: "1 / -1",
                minWidth: 0,
                width: "100%"
              }}
            >
              Submit Recipe
            </button>
          </form>
        </div>
      )}

      {shareSuccess && (
        <p style={{
          margin: "20px",
          padding: "12px",
          backgroundColor: "#e8f5e9",
          border: "1px solid #4CAF50",
          borderRadius: "8px",
          color: "#2e7d32",
          fontWeight: "bold"
        }}>
          ✓ {shareSuccess}
        </p>
      )}

      {loading ? (
        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#333", margin: "20px" }}>Loading recipes...</p>
      ) : error ? (
        <p style={{ margin: "20px", padding: "12px", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "8px", color: "#d32f2f", fontWeight: "bold" }}>
          {error}
        </p>
      ) : recipes.length === 0 ? (
        <p style={{ margin: "20px", padding: "12px", backgroundColor: "#fff3e0", border: "1px solid #ff9800", borderRadius: "8px", color: "#e65100", fontWeight: "bold" }}>
          No recipes matched your filters.
        </p>
      ) : (
        <div className="recipe-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px", margin: "20px" }}>
          {recipes.map((recipe, index) => {
            const dietTags = normalizeList(recipe.dietTags);
            const ingredients = normalizeList(recipe.ingredients);
            const steps = normalizeList(recipe.steps);
            const cardKey = recipe._id || `${recipe.name}-${index}`;
            const hasImage = Boolean(String(recipe.imageUrl || "").trim());

            return (
            <article key={cardKey} className="recipe-card" style={{ backgroundColor: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              {hasImage ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "linear-gradient(90deg, rgba(128, 216, 55, 0.18), rgba(50, 109, 75, 0.08))",
                    borderBottom: "1px solid rgba(50, 109, 75, 0.12)",
                    color: "rgb(32, 66, 44)",
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                >
                  User Shared Recipe
                </div>
              )}
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ backgroundColor: "rgb(128, 216, 55)", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                    {prettifyCategory(recipe.category)}
                  </span>
                  <span style={{ backgroundColor: "#ffeb3b", color: "#000", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                    {recipe.calories || 0} kcal
                  </span>
                  {recipe.prepTimeMinutes && (
                    <span style={{ backgroundColor: "#5b9bd5", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                      {recipe.prepTimeMinutes} min
                    </span>
                  )}
                </div>
                <h2 style={{ color: "rgb(32, 66, 44)", fontSize: "20px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.2 }}>
                  {recipe.name}
                </h2>
                <p style={{ fontSize: "14px", color: "#4b4b4b", marginBottom: "12px", lineHeight: "1.6", fontWeight: 500 }}>
                  {recipe.description}
                </p>
                <div style={{ marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#333", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Diet Tags</h3>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {dietTags.length > 0 ? dietTags.map((tag) => (
                      <span key={tag} style={{ border: "1px solid rgba(50, 109, 75, 0.18)", backgroundColor: "rgba(128, 216, 55, 0.12)", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", color: "rgb(32, 66, 44)", fontWeight: 700 }}>
                        {tag}
                      </span>
                    )) : <span style={{ fontSize: "12px", color: "#666" }}>No tags provided</span>}
                  </div>
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#333", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingredients</h3>
                  {ingredients.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#3f3f3f", fontSize: "13px", lineHeight: 1.6, fontWeight: 500 }}>
                      {ingredients.map((item, itemIndex) => (
                        <li key={`${cardKey}-ingredient-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>No ingredients provided</p>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#333", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Steps</h3>
                  {steps.length > 0 ? (
                    <ol style={{ margin: 0, paddingLeft: "18px", color: "#3f3f3f", fontSize: "13px", lineHeight: 1.6, fontWeight: 500 }}>
                      {steps.map((step, stepIndex) => (
                        <li key={`${cardKey}-step-${stepIndex}`}>{step}</li>
                      ))}
                    </ol>
                  ) : (
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>No cooking steps provided</p>
                  )}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecipePage;
