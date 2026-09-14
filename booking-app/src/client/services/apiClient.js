import axios from "axios";

const getBaseURL = () => {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD
      ? "https://backend-java-booking-tour.onrender.com/api"
      : "http://localhost:8080/api")
  );
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
