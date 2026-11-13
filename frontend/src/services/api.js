const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || API_URL.replace(/\/api\/?$/, "");

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("leafwise_token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { error: text }; }
  if (!response.ok) {
    const error = new Error(data?.error || "Something went wrong");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  request,
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  diseases: (crop = "") => request(`/diseases${crop ? `?crop=${encodeURIComponent(crop)}` : ""}`),
  disease: (id) => request(`/diseases/${id}`),
  predictions: () => request("/predictions"),
  prediction: (id) => request(`/predictions/${id}`),
  createPrediction: (file) => {
    const body = new FormData();
    body.append("image", file);
    return request("/predictions", { method: "POST", body });
  },
  profile: () => request("/users/profile"),
  updateProfile: (body) => request("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
  farms: () => request("/farms"),
};
