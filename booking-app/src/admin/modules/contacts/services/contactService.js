import { apiClient } from '../../login/services/authService';
const getAuthHeaders = () => {
  const userId = localStorage.getItem("userId");
  return {
    headers: {
      'X-User-Id': userId || ""
    }
  };
};

export const contactService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/contacts', getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi tải dữ liệu");
    }
  },


};