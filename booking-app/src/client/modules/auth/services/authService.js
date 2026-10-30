import { apiClient } from "../../../services/apiClient";

const AUTH_USER_KEY = "client_travelgo_user";
const AUTH_TOKEN_KEY = "client_travelgo_token";

export const authService = {
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!data || !token || token.split(".").length !== 3) {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      }
      return JSON.parse(data);
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  login: async (credentials) => {
    const email = credentials.email || credentials.username;
    const res = await apiClient.post("/admin/auth/login", {
      email,
      password: credentials.password,
    });
    const { accessToken, user: responseUser } = res.data || {};
    if (!accessToken || !responseUser) {
      throw new Error("Phản hồi đăng nhập không hợp lệ");
    }

    const user = {
      id: responseUser.id,
      username: responseUser.email,
      fullName: responseUser.fullName,
      email: responseUser.email,
      avatar: responseUser.avatar || "",
      role: responseUser.role,
    };
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { success: true, user, token: accessToken };
  },

  getProfile: async (id) => {
    const res = await apiClient.get(`/accounts/${id}`);
    return res.data;
  },

  updateProfile: async (id, profile) => {
    const body = new FormData();
    body.append("data", new Blob([JSON.stringify(profile)], { type: "application/json" }));
    const res = await apiClient.put(`/accounts/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await apiClient.post("/admin/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },

  register: async (data) => {
    const res = await apiClient.post("/admin/auth/register", {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    const { accessToken, user: responseUser } = res.data || {};
    if (!accessToken || !responseUser) {
      throw new Error("Phản hồi đăng ký không hợp lệ");
    }

    const user = {
      id: responseUser.id,
      username: responseUser.email,
      fullName: responseUser.fullName,
      email: responseUser.email,
      phone: data.phone || "",
      avatar: responseUser.avatar || "",
      role: responseUser.role,
    };
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { success: true, user, token: accessToken };
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event("auth-changed"));
  },
};
