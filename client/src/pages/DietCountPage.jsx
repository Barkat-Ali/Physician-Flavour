import { useEffect, useMemo, useState } from "react";
import { fetchDietAnalysis, fetchDietSuggestions } from "../services/api";

const defaultFoods = ["Banana", "Spinach", "Apple", "Chicken Breast"];

function NutrientChip({ label, value, unit }) {
  return (
    <div className="nutrient-chip" style={{
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      backgroundColor: "white",
      padding: "12px",
      minWidth: "100px"
    }}>
      <p style={{ fontSize: "12px", fontWeight: "bold", color: "#226644" }}>{label}</p>
      <p style={{ marginTop: "8px", fontSize: "18px", fontWeight: "bold", color: "#000" }}>
        {value}
        <span style={{ marginLeft: "4px", fontSize: "12px", fontWeight: "600", color: "#4CAF50" }}>{unit}</span>
      </p>
    </div>
  );
}

function DietCountPage() {
  const [query, setQuery] = useState("Banana");
  const [serving, setServing] = useState(100);
  const [suggestions, setSuggestions] = useState(defaultFoods);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions(defaultFoods);
        return;
      }

      try {
        const data = await fetchDietSuggestions(query);
        if (active) {
          setSuggestions(data.length ? data.map((item) => item.name) : defaultFoods);
        }
      } catch (_error) {
        if (active) {
          setSuggestions(defaultFoods);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const nutrients = useMemo(() => analysis?.nutrients || {}, [analysis]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await fetchDietAnalysis(query.trim(), serving);
      setAnalysis(result);
    } catch (requestError) {
      setAnalysis(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diet-page" style={{ backgroundColor: "#f5f5dc", padding: "20px", minHeight: "100vh" }}>
      <h1 style={{ color: "rgb(32, 66, 44)", textShadow: "none", margin: "20px 0", fontWeight: 800, letterSpacing: "0.02em" }}>Diet Count</h1>
      <p style={{ margin: "20px" }}>
        Check vitamins, minerals, macros, and calories per serving. Enter a food name,
        choose your serving in grams, and get a fast nutritional snapshot.
      </p>

      <form className="diet-form" onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", margin: "20px", alignItems: "flex-end" }}>
        <label>
          <span style={{ fontWeight: "bold", color: "#333" }}>Food name</span>
          <input
            list="food-suggestions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{
              marginTop: "6px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              boxSizing: "border-box"
            }}
            placeholder="Try Banana or Spinach"
            required
          />
          <datalist id="food-suggestions">
            {suggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>

        <label>
          <span style={{ fontWeight: "bold", color: "#333" }}>Serving (g)</span>
          <input
            type="number"
            min="1"
            value={serving}
            onChange={(event) => setServing(Number(event.target.value))}
            style={{
              marginTop: "6px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              boxSizing: "border-box"
            }}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <p style={{
          margin: "20px",
          padding: "12px",
          backgroundColor: "#ffebee",
          border: "1px solid #f44336",
          borderRadius: "8px",
          color: "#d32f2f",
          fontWeight: "bold"
        }}>
          {error}
        </p>
      )}

      {analysis && (
        <div className="diet-results" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", margin: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
            <p style={{ fontSize: "12px", fontWeight: "bold", color: "#4CAF50" }}>NUTRITION RESULT</p>
            <h2 style={{ color: "rgb(32, 66, 44)", textShadow: "none", marginTop: "10px", marginBottom: "10px", fontWeight: 800, letterSpacing: "0.01em" }}>
              {analysis.food}
              <span style={{
                marginLeft: "10px",
                backgroundColor: "rgb(128, 216, 55)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "14px"
              }}>
                {analysis.serving}g
              </span>
            </h2>

            <div className="nutrient-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <NutrientChip label="Calories" value={nutrients.calories} unit="kcal" />
              <NutrientChip label="Protein" value={nutrients.protein} unit="g" />
              <NutrientChip label="Carbs" value={nutrients.carbs} unit="g" />
              <NutrientChip label="Fats" value={nutrients.fats} unit="g" />
              <NutrientChip label="Fiber" value={nutrients.fiber} unit="g" />
              <NutrientChip label="Vitamin C" value={nutrients.vitaminC} unit="mg" />
              <NutrientChip label="Iron" value={nutrients.iron} unit="mg" />
              <NutrientChip label="Calcium" value={nutrients.calcium} unit="mg" />
              <NutrientChip label="Potassium" value={nutrients.potassium} unit="mg" />
            </div>
          </div>

          <div className="diet-benefits" style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
            <h3 style={{ color: "rgb(32, 66, 44)", textShadow: "none", marginBottom: "12px", fontWeight: 800, letterSpacing: "0.01em" }}>Health Benefits</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {analysis.healthBenefits.map((benefit) => (
                <li key={benefit} style={{
                  backgroundColor: "#f0f8f0",
                  padding: "10px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietCountPage;
