import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Diet Count", to: "/diet-count" },
  { label: "Recipes", to: "/recipes" },
  { label: "Admin", to: "/admin" }
];

function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "linear-gradient(90deg, rgb(50, 109, 75) 0%, rgb(36, 88, 58) 100%)",
        borderBottom: "1px solid rgba(128, 216, 55, 0.35)",
        boxShadow: "0 10px 30px rgba(18, 40, 28, 0.18)"
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: "16px",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "10px 18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgb(128, 216, 55), rgb(176, 233, 104))",
              color: "rgb(32, 66, 44)",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              letterSpacing: "0.08em",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.22)"
            }}
            aria-label="Physician Flavour logo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 14c0-4.4 3.6-8 8-8 1.2 0 2.4.3 3.4.8-.8 1.8-2.5 3.2-4.5 3.8 1.2.9 2 2.4 2 4.1 0 2.8-2.2 5-5 5-2.2 0-4-1.8-4-4.7z"
                fill="rgb(32, 66, 44)"
              />
              <path
                d="M14.2 4.5c1.2-1.1 2.8-1.8 4.5-1.9-.1 1.7-.8 3.4-2.1 4.7-1.2 1.2-2.8 1.9-4.4 2 .1-1.8.8-3.5 2-4.8z"
                fill="rgb(32, 66, 44)"
              />
            </svg>
          </div>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ color: "white", fontSize: "1.05rem", fontWeight: 800 }}>Physician Flavour</div>
            <div style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.82rem" }}>
              Diet intelligence and recipe sharing
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => ["nav-pill", isActive ? "nav-pill-active" : ""].join(" ").trim()}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "rgb(32, 66, 44)" : "white",
                backgroundColor: isActive ? "rgb(128, 216, 55)" : "rgba(255, 255, 255, 0.08)",
                border: isActive ? "1px solid rgba(128, 216, 55, 0.9)" : "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "999px",
                padding: "0.8rem 1.15rem",
                fontWeight: 800,
                letterSpacing: "0.01em",
                transition: "transform 160ms ease, background-color 160ms ease, color 160ms ease, border-color 160ms ease",
                boxShadow: isActive ? "0 10px 22px rgba(128, 216, 55, 0.18)" : "none"
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
