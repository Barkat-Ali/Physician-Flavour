import { Link } from "react-router-dom";
import saladImage from "../assets/salad.png";
import dietImage from "../assets/diet.png";
import samosaImage from "../assets/samosa.png";

function HomePage() {
  return (
    <div style={{ backgroundColor: "#f5f5dc", width: "100%", minHeight: "100vh" }}>
      {/* Marquee Welcome */}
      <marquee behavior="slide" style={{ backgroundColor: "#f5f5dc", padding: "2px" }}>
        <h1 style={{ color: "rgb(17, 231, 92)", textShadow: "none", margin: 0, fontWeight: 800, letterSpacing: "0.02em",fontSize: "2.5rem" }}>
          Welcome To Physician Flavour!
        </h1>
      </marquee>

      {/* Introduction */}
      <div style={{ padding: "20px", margin: "10px" }}>
        <p>
          Get a perfectly balanced diet plan tailored to your nutritional needs, based on the vitamins, minerals, and
          macronutrients in each food you consume. Our scientifically designed meal plans ensure optimal health, energy,
          and wellness—because what you eat should work for you, not against you. <br />
          At Physician Flavour, we craft personalized diet plans based on your unique nutritional needs, lifestyle, and
          health goals. Whether you're fueling fitness, managing a condition, or simply striving for better energy, our
          science-backed meal plans ensure every bite works for you.
        </p>
      </div>

      {/* Why Choose Section */}
      <h2 style={{ margin: "10px" }}>Why Choose Physician Flavour?</h2>
      <div style={{ display: "flex", columnGap: "0%", width: "100%", padding: "0 20px" }}>
        <div style={{ width: "60vw" }}>
          <p>
            🔬 <b>Science-Backed Nutrition-</b> Precision meal plans based on vitamins, macros & health needs. <br />
            🍎 <b>Smart Food Database-</b> Search any food to see its nutrients + health benefits. <br />
            👩‍🍳 <b>Chef-Approved Recipes-</b>Delicious meals that fit your diet (Keto, Vegan, Gluten-Free, etc.).
            <br />
          </p>
          <h2>Most Favourite</h2>
          <p>You will find these in Recipe Section.</p>
          <div>
            <div style={{ display: "flex", columnGap: "20%" }}>
              <ul>
                <li>Biryani</li>
                <li>Chilli Chicken </li>
                <li>Mutton Karahi</li>
                <li>Beef Butter</li>
                <li>Tawa Qeema</li>
                <li>Qabli Pulao</li>
                <li>Salty Rosh</li>
                <li>Butter Chicken</li>
              </ul>
              <ul>
                <li style={{ fontWeight: "bold", marginLeft: "5%" }}>Desserts</li>
                <li>Chocolate Cake</li>
                <li>Pineapple Cake</li>
                <li>Strawberry Cake</li>
                <li>Honey Cake</li>
                <li>Ras Malai</li>
                <li>Custard</li>
                <li>Shahi Tukrey</li>
                <li>Cream Chat</li>
              </ul>
              <ul>
                <li>Lemonade</li>
                <li>Mint Margarita</li>
                <li>Fresher</li>
                <li>Peach Ginger</li>
                <li>Roasted Milk</li>
                <li>Masala Tea</li>
                <li>Green Tea</li>
                <li>Protein Shake</li>
              </ul>
            </div>
            <Link
              to="/recipes"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                textDecoration: "none",
                borderRadius: "5px",
                display: "inline-block",
                marginLeft: "1vw",
                marginTop: "1vh",
                fontWeight: "bold"
              }}
            >
              Try Recipe Now →
            </Link>
          </div>
        </div>

        <div style={{ width: "40vw", marginRight: "2%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              padding: "10px",
              background: "linear-gradient(155deg, rgba(128,216,55,0.2), rgba(50,109,75,0.12))",
              borderRadius: "16px",
              border: "1px solid rgba(50,109,75,0.2)",
              boxShadow: "0 14px 28px rgba(0,0,0,0.08)"
            }}
          >
            <img
              src={saladImage}
              alt="Healthy salad"
              style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "12px" }}
            />
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
              alt="Karahi dish"
              style={{ width: "100%", height: "170px", objectFit: "cover", borderRadius: "12px" }}
            />
            <img
              src={samosaImage}
              alt="Spicy food"
              style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "12px", gridColumn: "1 / 3" }}
            />
            <div
              style={{
                gridColumn: "1 / 3",
                backgroundColor: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(50,109,75,0.15)",
                borderRadius: "12px",
                padding: "10px"
              }}
            >
              <p style={{ margin: 0, color: "rgb(32,66,44)", fontWeight: 700, fontSize: "14px" }}>
                Fresh ingredients, balanced nutrition, and chef-style taste in every plan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Count Section */}
      <h2 style={{ margin: "30px 20px 0 20px" }}>Diet Count: Your Personal Nutrient Calculator</h2>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "5px", margin: "30px 20px" }}>
        <div style={{ width: "60%" }}>
          <p>
            Ever wondered how much vitamin C is in an orange or protein in spinach? Our <strong>Diet Count</strong>
            tool analyzes:
          </p>
          <ul style={{ margin: "10px 0 15px 20px" }}>
            <li>
              <strong>Vitamins & Minerals</strong> (A, C, iron, calcium, etc.)
            </li>
            <li>
              <strong>Macronutrients</strong> (carbs, protein, fats)
            </li>
            <li>
              <strong>Calories & Fiber</strong> per serving
            </li>
          </ul>

          <h3 style={{ marginTop: "15px" }}>How it works?</h3>
          <ul style={{ margin: "10px 0 15px 20px" }}>
            <li>
              <strong>Search</strong> any fruit, vegetable, or ingredient
            </li>
            <li>
              <strong>Select</strong> your portion size (e.g., 1 apple, 100g)
            </li>
            <li>
              <strong>Get instant nutrition data</strong> + health benefits
            </li>
          </ul>

          <p style={{ margin: "15px 0" }}>
            <b>Example</b>
            <br />
            🔍 <em>"Banana (medium)"</em> → 🍌{" "}
            <strong>105 kcal | 27g carbs | 3g fiber | 12% daily potassium</strong>
          </p>

          <Link
            to="/diet-count"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 15px",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              marginLeft: "1vw",
              marginTop: "1vh",
              fontWeight: "bold"
            }}
          >
            Try Diet Count Now →
          </Link>
        </div>

        <div style={{ width: "40%" }}>
          <img
            src={dietImage}
            alt="Nutrition Analysis"
            style={{
              maxWidth: "70%",
              maxHeight: "300px",
              objectFit: "contain",
              borderRadius: "8px",
              marginLeft: "0%",
              marginTop: "6%"
            }}
          />
        </div>
      </div>

    </div>
  );
}

export default HomePage;
