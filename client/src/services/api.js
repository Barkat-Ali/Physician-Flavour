const normalizeApiBaseUrl = (value) => {
  const raw = String(value || "").trim();
  const fallback = "http://localhost:5000/api";

  if (!raw) {
    return fallback;
  }

  // Fix common typo: https/example.com/api
  const protocolFixed = raw.replace(/^https?\/(?!\/)/i, (match) => `${match}/`);

  try {
    const parsed = new URL(protocolFixed);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "");
    const withApiSuffix = normalizedPath.endsWith("/api")
      ? normalizedPath
      : `${normalizedPath}/api`;

    return `${parsed.origin}${withApiSuffix}`;
  } catch (_error) {
    return fallback;
  }
};

const ADMIN_KEY_STORAGE_KEY = "physician_flavour_admin_key";
const API_BASE = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return { json: null, text: "" };
  }

  try {
    return { json: JSON.parse(text), text };
  } catch (_error) {
    return { json: null, text };
  }
}

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

  const requestUrl = `${API_BASE}${path}`;

  const response = await fetch(requestUrl, {
    headers: mergedHeaders,
    ...requestOptions
  });

  const { json, text } = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      (json && json.message) ||
      (text && text.trim().slice(0, 160)) ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  if (json === null) {
    throw new Error("API returned a non-JSON response.");
  }

  return json;
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
