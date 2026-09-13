import { apiClient } from "../../login/services/authService"; // Đảm bảo đường dẫn này đúng với dự án của bạn

export const reviewService = {
  getAll: async () => {
    const response = await apiClient.get('/reviews');
    return response.data.data || response.data;
  },

  toggleVisibility: async (id) => {
    const response = await apiClient.put(`/reviews/${id}/toggle-visibility`);
    return response.data.data || response.data;
  },

  getTrash: async () => {
    const response = await apiClient.get('/reviews/trash');
    return response.data.data || response.data;
  },

  restore: async (id) => {
    const response = await apiClient.put(`/reviews/${id}/restore`);
    return response.data.data || response.data;
  },

  hardDelete: async (id) => {
    const response = await apiClient.delete(`/reviews/${id}/hard`);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  }
};