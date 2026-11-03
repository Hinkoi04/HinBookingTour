import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "../../services/apiConfig";

const AUTH_TOKEN_KEY = "client_travelgo_token";
const AUTH_USER_KEY = "client_travelgo_user";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const isPublicAuthRequest =
    config.url?.includes("/admin/auth/login") ||
    config.url?.includes("/admin/auth/register");
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && !isPublicAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    const headers = config?.headers;
    const requestAuthorization =
      headers?.get?.("Authorization") ??
      headers?.Authorization ??
      headers?.authorization;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const requestHasToken =
      typeof requestAuthorization === "string" &&
      requestAuthorization.startsWith("Bearer ");

    if (
      error.response?.status === 401 &&
      token &&
      requestAuthorization === `Bearer ${token}`
    ) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new Event("auth-changed"));
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    if (
      error.response?.status === 401 &&
      requestHasToken &&
      !localStorage.getItem(AUTH_TOKEN_KEY) &&
      config?.method?.toUpperCase() === "GET" &&
      !config._retriedWithoutAuth
    ) {
      config._retriedWithoutAuth = true;
      if (typeof headers.delete === "function") {
        headers.delete("Authorization");
      } else {
        delete headers.Authorization;
        delete headers.authorization;
      }
      return apiClient.request(config);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
