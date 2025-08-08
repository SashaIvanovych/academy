import api from "./api";

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
