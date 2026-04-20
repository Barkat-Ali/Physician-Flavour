import { useState } from "react";
import { saveSubscription } from "../services/api";

function Footer() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const email = formData.email.trim().toLowerCase();
  const password = formData.password;
  const showEmailError = emailTouched && email.length > 0 && !isValidEmail(email);

  const handleAction = async (active) => {
    setMessage("");
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setEmailTouched(true);
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await saveSubscription({ email, password, active });
      setMessage(response.message || (active ? "Subscribed successfully." : "Unsubscribed successfully."));
      setFormData({ email: "", password: "" });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ width: "100%", backgroundColor: "#4CAF50", marginTop: "40px" }}>
      <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Top Section - About, Links, Contact, Services */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          {/* About Section */}
          <div>
            <h3 style={{ color: "white", fontWeight: 800, marginBottom: "12px", fontSize: "16px" }}>About Us</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>
              Physician Flavour is certified by National Food Authority, delivering science-backed nutrition guidance and chef-approved recipes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: "white", fontWeight: 800, marginBottom: "12px", fontSize: "16px" }}>Quick Links</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "8px" }}>
                <a href="/" style={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", fontSize: "13px" }}>Home</a>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <a href="/diet-count" style={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", fontSize: "13px" }}>Diet Count</a>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <a href="/recipes" style={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", fontSize: "13px" }}>Recipes</a>
              </li>
              <li>
                <a href="/admin" style={{ color: "rgba(255, 255, 255, 0.9)", textDecoration: "none", fontSize: "13px" }}>Admin</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ color: "white", fontWeight: 800, marginBottom: "12px", fontSize: "16px" }}>Services</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "13px" }}>
              <li style={{ marginBottom: "8px", color: "rgba(255, 255, 255, 0.9)" }}>🍎 Nutrient Analysis</li>
              <li style={{ marginBottom: "8px", color: "rgba(255, 255, 255, 0.9)" }}>📖 Recipe Database</li>
              <li style={{ color: "rgba(255, 255, 255, 0.9)" }}>💪 Health Tracking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "white", fontWeight: 800, marginBottom: "12px", fontSize: "16px" }}>Contact</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>
              📧 info@physicianflavour.com<br />
              📞 +92-32500450056<br />
              📍 Pakistan
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.3)", margin: "0 0 40px 0" }} />

        {/* Newsletter Section */}
        <div style={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "30px", marginBottom: "30px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h3 style={{ color: "white", fontWeight: 800, marginBottom: "8px", fontSize: "18px", textAlign: "center" }}>Stay Updated</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
              Subscribe to get nutrition tips, recipe updates, and health insights delivered to your inbox.
            </p>
            
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onBlur={() => setEmailTouched(true)}
                onChange={(event) => {
                  const nextEmail = event.target.value;
                  if (!emailTouched) {
                    setEmailTouched(true);
                  }
                  setFormData((current) => ({ ...current, email: nextEmail }));
                }}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: showEmailError ? "1px solid #ffb3b3" : "1px solid rgba(255,255,255,0.2)",
                  outline: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  fontSize: "13px"
                }}
              />
              <input
                type="password"
                placeholder="Password (4+ chars)"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  outline: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  fontSize: "13px"
                }}
              />
            </div>

            {showEmailError && (
              <p style={{ color: "#fff2f2", fontSize: "12px", margin: "8px 0" }}>
                ⚠️ Email format is invalid.
              </p>
            )}
            {error && <p style={{ color: "#fff2f2", fontSize: "12px", margin: "8px 0" }}>⚠️ {error}</p>}
            {message && <p style={{ color: "rgb(200, 255, 200)", fontSize: "12px", margin: "8px 0" }}>✓ {message}</p>}
            
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleAction(true)}
                style={{
                  padding: "12px 28px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "rgb(128, 216, 55)",
                  color: "rgb(32, 66, 44)",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Loading..." : "Subscribe"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleAction(false)}
                style={{
                  padding: "12px 28px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  backgroundColor: "transparent",
                  color: "white",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  opacity: loading ? 0.7 : 1
                }}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Links */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px", margin: 0 }}>
            © 2026 Physician Flavour. All rights reserved by National Food Authority.
          </p>
          <div style={{ display: "flex", gap: "20px", fontSize: "12px", flexWrap: "wrap" }}>
            <a href="#" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
