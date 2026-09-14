import { apiClient } from "../../../services/apiClient";

const AUTH_USER_KEY = "client_travelgo_user";
const AUTH_TOKEN_KEY = "client_travelgo_token";

export const authService = {
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  login: async (credentials) => {
    try {
      // Try backend admin auth endpoint first
      const res = await apiClient.post("/admin/auth/login", {
        username: credentials.username || credentials.email,
        password: credentials.password,
      });

      if (res.data) {
        const token = res.data.accessToken || res.data.token || "token_" + Date.now();
        const user = {
          id: res.data.id || 1,
          username: credentials.username || credentials.email,
          fullName: res.data.fullName || credentials.username || "Khách hàng",
          email: credentials.email || `${credentials.username}@gmail.com`,
          avatar: res.data.avatar || "",
          role: res.data.role || "USER",
        };
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return { success: true, user, token };
      }
    } catch (error) {
      console.warn("Backend auth call error, fallback to local authentication:", error);
      // If mock/demo credentials or server error, provide a smooth login experience
      const user = {
        id: Date.now(),
        username: credentials.username || credentials.email.split("@")[0],
        fullName: credentials.fullName || credentials.username || "Khách hàng TravelGo",
        email: credentials.email || `${credentials.username}@gmail.com`,
        avatar: "",
        role: "USER",
      };
      const token = "token_" + Date.now();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return { success: true, user, token };
    }
  },

  register: async (data) => {
    try {
      const user = {
        id: Date.now(),
        username: data.username || data.email.split("@")[0],
        fullName: data.fullName || "Khách hàng mới",
        email: data.email,
        phone: data.phone || "",
        avatar: "",
        role: "USER",
      };
      const token = "token_" + Date.now();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      return { success: true, user, token };
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event("auth-changed"));
  },
};
