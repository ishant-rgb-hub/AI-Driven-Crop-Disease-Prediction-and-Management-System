const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const AUTH_EXPIRED_EVENT = "leafwise:auth-expired";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, { body, headers = {}, ...options } = {}) {
  const token = window.localStorage.getItem("leafwise.token");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  let payload = null;
  if (response.status !== 204) {
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        throw new ApiError("The server returned an unreadable response.", response.status);
      }
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(
      payload?.error || payload?.message || "The request could not be completed.",
      response.status,
    );
  }

  return payload;
}

export { AUTH_EXPIRED_EVENT };
