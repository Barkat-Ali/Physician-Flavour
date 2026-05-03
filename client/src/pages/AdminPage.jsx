import { useEffect, useState } from "react";
import {
  adminLogin,
  approveRecipe,
  deleteRecipe,
  deleteSubscription,
  fetchPendingRecipes,
  fetchSubscriptions,
  getAdminAccessKey,
  setAdminAccessKey,
  updateSubscriptionStatus
} from "../services/api";

function AdminPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [accessKeyInput, setAccessKeyInput] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(Boolean(getAdminAccessKey()));
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const clearActionAlerts = () => {
    setActionMessage("");
    setActionError("");
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [subscriptionData, pendingRecipeData] = await Promise.all([
        fetchSubscriptions(),
        fetchPendingRecipes()
      ]);

      setSubscriptions(subscriptionData);
      setPendingRecipes(pendingRecipeData);
    } catch (requestError) {
      if (requestError.message.toLowerCase().includes("admin access denied") || requestError.message.toLowerCase().includes("invalid credentials")) {
        setAdminAccessKey("");
        setIsAdminAuthenticated(false);
        setAuthError("Your admin session expired. Please login again.");
      }
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    setActionError("");

    if (!accessKeyInput.trim()) {
      setAuthError("Please enter your admin access key.");
      return;
    }

    setAuthLoading(true);
    try {
      await adminLogin(accessKeyInput.trim());
      setAdminAccessKey(accessKeyInput.trim());
      setAccessKeyInput("");
      setIsAdminAuthenticated(true);
      setError("");
    } catch (requestError) {
      setAuthError(requestError.message || "Login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminAccessKey("");
    setIsAdminAuthenticated(false);
    setSubscriptions([]);
    setPendingRecipes([]);
    setActionMessage("");
    setActionError("");
    setError("");
    setAuthError("");
  };

  const handleApprove = async (id) => {
    clearActionAlerts();
    try {
      await approveRecipe(id);
      setActionMessage("Recipe approved successfully.");
      await loadData();
    } catch (requestError) {
      setActionError(requestError.message || "Could not approve recipe.");
    }
  };

  const handleDeleteRecipe = async (id) => {
    clearActionAlerts();
    try {
      await deleteRecipe(id);
      setActionMessage("Recipe deleted successfully.");
      await loadData();
    } catch (requestError) {
      setActionError(requestError.message || "Could not delete recipe.");
    }
  };

  const handleToggleSubscription = async (id, active) => {
    clearActionAlerts();
    try {
      await updateSubscriptionStatus(id, active);
      setActionMessage(active ? "Subscription allowed successfully." : "Subscription paused successfully.");
      await loadData();
    } catch (requestError) {
      setActionError(requestError.message || "Could not update subscription.");
    }
  };

  const handleDeleteSubscription = async (id) => {
    clearActionAlerts();
    try {
      await deleteSubscription(id);
      setActionMessage("Subscription deleted successfully.");
      await loadData();
    } catch (requestError) {
      setActionError(requestError.message || "Could not delete subscription.");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <section className="admin-page" style={{ padding: "20px", minHeight: "100vh", display: "grid", placeItems: "start center" }}>
        <div style={{ width: "100%", maxWidth: "440px", backgroundColor: "white", border: "1px solid rgba(50, 109, 75, 0.18)", borderRadius: "12px", padding: "20px" }}>
          <h1 style={{ color: "rgb(32, 66, 44)", fontWeight: 800, marginBottom: "10px" }}>Admin Login</h1>
          <p style={{ marginBottom: "14px", color: "#4b4b4b" }}>
            Enter your admin access key to open the dashboard.
          </p>

          <form onSubmit={handleAdminLogin} style={{ display: "grid", gap: "12px" }}>
            <input
              type="password"
              value={accessKeyInput}
              onChange={(event) => setAccessKeyInput(event.target.value)}
              placeholder="Admin access key"
              style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px 12px", outline: "none" }}
            />
            <button
              type="submit"
              disabled={authLoading}
              style={{
                border: "none",
                borderRadius: "8px",
                padding: "11px 14px",
                fontWeight: 800,
                cursor: authLoading ? "not-allowed" : "pointer",
                backgroundColor: "rgb(50, 109, 75)",
                color: "white"
              }}
            >
              {authLoading ? "Checking..." : "Login"}
            </button>
          </form>

          {authError && (
            <p style={{ marginTop: "12px", padding: "10px", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "8px", color: "#b71c1c", fontWeight: 700 }}>
              {authError}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page" style={{ padding: "20px", minHeight: "100vh" }}>
      <div className="admin-topbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h1 style={{ color: "rgb(32, 66, 44)", fontWeight: 800, marginBottom: "10px" }}>Admin Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          style={{ padding: "8px 14px", borderRadius: "999px", border: "none", backgroundColor: "#d32f2f", color: "white", fontWeight: 700, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
      <p style={{ marginBottom: "20px" }}>Manage subscriptions and moderate recipe submissions.</p>

      {loading && <p>Loading admin data...</p>}
      {error && (
        <p style={{ padding: "12px", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "8px", color: "#b71c1c", fontWeight: 700 }}>
          {error}
        </p>
      )}
      {actionMessage && (
        <p style={{ marginTop: "10px", padding: "12px", backgroundColor: "#e8f5e9", border: "1px solid #4CAF50", borderRadius: "8px", color: "#1b5e20", fontWeight: 700 }}>
          {actionMessage}
        </p>
      )}
      {actionError && (
        <p style={{ marginTop: "10px", padding: "12px", backgroundColor: "#ffebee", border: "1px solid #f44336", borderRadius: "8px", color: "#b71c1c", fontWeight: 700 }}>
          {actionError}
        </p>
      )}

      <div className="admin-panels" style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", marginTop: "20px" }}>
        <div className="admin-card" style={{ backgroundColor: "white", borderRadius: "12px", padding: "18px", border: "1px solid rgba(50, 109, 75, 0.14)" }}>
          <h2 style={{ color: "rgb(32, 66, 44)", fontWeight: 800, marginBottom: "12px" }}>Subscriptions</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="admin-info-card" style={{ border: "1px solid #e6e6e6", borderRadius: "10px", padding: "12px" }}>
                <p style={{ fontWeight: 800, color: "#243" }}>{subscription.email}</p>
                <p style={{ fontSize: "13px", color: subscription.active ? "#2e7d32" : "#9e9e9e", marginTop: "4px" }}>
                  {subscription.active ? "Active" : "Inactive"}
                </p>
                <div className="admin-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleSubscription(subscription._id, true)}
                    style={{ padding: "8px 12px", borderRadius: "999px", border: "none", backgroundColor: "#4CAF50", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Allow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSubscription(subscription._id, false)}
                    style={{ padding: "8px 12px", borderRadius: "999px", border: "none", backgroundColor: "#f39c12", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubscription(subscription._id)}
                    style={{ padding: "8px 12px", borderRadius: "999px", border: "none", backgroundColor: "#d32f2f", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!subscriptions.length && !loading && <p>No subscriptions found.</p>}
          </div>
        </div>

        <div className="admin-card" style={{ backgroundColor: "white", borderRadius: "12px", padding: "18px", border: "1px solid rgba(50, 109, 75, 0.14)" }}>
          <h2 style={{ color: "rgb(32, 66, 44)", fontWeight: 800, marginBottom: "12px" }}>Pending Recipes</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {pendingRecipes.map((recipe) => (
              <div key={recipe._id} className="admin-info-card" style={{ border: "1px solid #e6e6e6", borderRadius: "10px", padding: "12px" }}>
                <p style={{ fontWeight: 800, color: "#243" }}>{recipe.name}</p>
                <p style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>{recipe.description}</p>
                <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                  {recipe.category} | {recipe.calories} kcal | {recipe.prepTimeMinutes} min
                </p>
                <div className="admin-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => handleApprove(recipe._id)}
                    style={{ padding: "8px 12px", borderRadius: "999px", border: "none", backgroundColor: "#4CAF50", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Allow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    style={{ padding: "8px 12px", borderRadius: "999px", border: "none", backgroundColor: "#d32f2f", color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!pendingRecipes.length && !loading && <p>No pending recipes found.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;