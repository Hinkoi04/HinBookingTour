import { apiClient } from '../../login/services/authService';

const getAuthHeaders = () => ({
  headers: {
    'X-User-Id': localStorage.getItem("userId") || ""
  }
});

export const couponService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/coupon');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách mã giảm giá thất bại");
    }
  },

  getAllTrash: async () => {
    try {
      const response = await apiClient.get('/coupon/trash');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách thùng rác thất bại");
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/coupon', data, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Thêm mã giảm giá thất bại");
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/coupon/${id}`, data, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Cập nhật mã giảm giá thất bại");
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/coupon/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Xóa mã giảm giá thất bại");
    }
  },

  restore: async (id) => {
    try {
      const response = await apiClient.put(`/coupon/${id}/restore`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Khôi phục mã giảm giá thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/coupon/${id}/force`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Xóa vĩnh viễn thất bại");
    }
  }
};