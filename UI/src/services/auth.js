import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${API_BASE_URL}/auth/refresh`
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await api.post("/auth/refresh", { refreshToken });
        const { access_token, refresh_token } = response.data.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error.response && error.response.data.message
      ? new Error(error.response.data.message)
      : new Error("An unexpected error occurred");
  }
);

export const AuthService = {
  async register(email, password) {
    const response = await api.post("/auth/register", { email, password });
    return response.data.data;
  },

  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const { access_token, refresh_token, id } = response.data.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user_id", id);
    return { access_token, refresh_token, id };
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await api.post("/auth/refresh", { refreshToken });
    const { access_token, refresh_token } = response.data.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    return { access_token, refresh_token };
  },

  async logout() {
    await api.post("/auth/logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data.data;
  },
};
