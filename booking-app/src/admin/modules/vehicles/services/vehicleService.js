import { apiClient } from '../../login/services/authService';

const getAuthHeaders = () => ({
  headers: {
    'X-User-Id': localStorage.getItem("userId") || ""
  }
});

export const vehicleService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/vehicle');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách phương tiện thất bại");
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/vehicle/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Không tìm thấy thông tin phương tiện");
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/vehicle', data, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Thêm phương tiện thất bại");
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/vehicle/${id}`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Cập nhật phương tiện thất bại");
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/vehicle/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa phương tiện thất bại");
    }
  },

  getAllTrash: async () => {
    try {
      const response = await apiClient.get('/vehicle/trash');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách thùng rác thất bại");
    }
  },

  restore: async (id) => {
    try {
      const response = await apiClient.put(`/vehicle/${id}/restore`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Khôi phục phương tiện thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/vehicle/${id}/force`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa vĩnh viễn phương tiện thất bại");
    }
  }
};