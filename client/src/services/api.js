const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_KEY_STORAGE_KEY = "pf_admin_access_key";

const getStoredAdminAccessKey = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(ADMIN_KEY_STORAGE_KEY) || "";
};

export function setAdminAccessKey(accessKey) {
  if (typeof window === "undefined") {
    return;
  }

  if (accessKey) {
    window.localStorage.setItem(ADMIN_KEY_STORAGE_KEY, accessKey);
  } else {
    window.localStorage.removeItem(ADMIN_KEY_STORAGE_KEY);
  }
}

export function getAdminAccessKey() {
  return getStoredAdminAccessKey();
}

async function request(path, options = {}) {
  const adminAccessKey = options.admin ? getStoredAdminAccessKey() : "";
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (adminAccessKey) {
    mergedHeaders["x-admin-key"] = adminAccessKey;
  }

  const { admin, ...requestOptions } = options;

  const response = await fetch(`${API_BASE}${path}`, {
    headers: mergedHeaders,
    ...requestOptions
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const body = await response.json();
      message = body.message || message;
    } catch (_error) {
      // Keep fallback message when non-JSON response is returned.
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchDietAnalysis(query, serving) {
  const search = new URLSearchParams({
    query,
    serving: String(serving)
  });
  return request(`/diet?${search.toString()}`);
}

export function fetchDietSuggestions(query) {
  const search = new URLSearchParams({ query });
  return request(`/diet/suggestions?${search.toString()}`);
}

export function fetchRecipes({ search = "", category = "", tag = "" }) {
  const query = new URLSearchParams({ search, category, tag });
  return request(`/recipes?${query.toString()}`);
}

export function submitRecipe(recipe) {
  return request("/recipes", {
    method: "POST",
    body: JSON.stringify(recipe)
  });
}

export function fetchPendingRecipes() {
  return request("/recipes/admin/pending", { admin: true });
}

export function approveRecipe(id) {
  return request(`/recipes/admin/${id}/approve`, {
    method: "PATCH",
    admin: true
  });
}

export function deleteRecipe(id) {
  return request(`/recipes/admin/${id}`, {
    method: "DELETE",
    admin: true
  });
}

export function fetchSubscriptions() {
  return request("/subscriptions", { admin: true });
}

export function saveSubscription(payload) {
  return request("/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateSubscriptionStatus(id, active) {
  return request(`/subscriptions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
    admin: true
  });
}

export function deleteSubscription(id) {
  return request(`/subscriptions/${id}`, {
    method: "DELETE",
    admin: true
  });
}

export function adminLogin(accessKey) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ accessKey })
  });
}
