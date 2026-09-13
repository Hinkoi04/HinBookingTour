import { apiClient } from '../../login/services/authService';

export const departureService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/departure');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách lịch khởi hành thất bại");
    }
  },
  getAvailableGuides: async (startDate, endDate, excludeDepartureId = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (excludeDepartureId) params.excludeDepartureId = excludeDepartureId;

      const response = await apiClient.get('/departure/guides', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách hướng dẫn viên thất bại");
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/departure', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Tạo lịch khởi hành thất bại");
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/departure/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Cập nhật lịch khởi hành thất bại");
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/departure/${id}`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa lịch khởi hành thất bại");
    }
  },
  
  getAllTrash: async () => {
    try {
      const response = await apiClient.get('/departure/trash');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Lấy danh sách thùng rác thất bại");
    }
  },

  restore: async (id) => {
    try {
      const response = await apiClient.put(`/departure/${id}/restore`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Khôi phục thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/departure/${id}/force`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa vĩnh viễn thất bại");
    }
  }
};