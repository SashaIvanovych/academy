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
        const { access_token, refresh_token, id } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user_id", id);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
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
    try {
      const response = await api.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  },

  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user_id", response.data.id);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await api.post("/auth/refresh", { refreshToken });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user_id", response.data.id);
      return response.data;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      throw new Error(error.message || "Token refresh failed");
    }
  },

  async logout(userId) {
    try {
      await api.post("/auth/logout", { userId });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
    } catch (error) {
      throw new Error(error.message || "Logout failed");
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch profile");
    }
  },
};
