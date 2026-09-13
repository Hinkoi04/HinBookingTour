import { apiClient } from '../../login/services/authService';

export const categoryService = {
  getAllActive: async () => {
    try {
      const response = await apiClient.get('/category?status=active');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi tải dữ liệu");
    }
  },

  getAllTrash: async () => {
    try {
      const response = await apiClient.get('/category/trash');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) return [];
      throw new Error(error.response?.data?.message || "Lỗi khi tải dữ liệu thùng rác");
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/category', data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi khi tạo danh mục";
      throw new Error(errorMsg);
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/category/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi khi cập nhật danh mục";
      throw new Error(errorMsg);
    }
  },

  softDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/category/${id}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Lỗi khi xóa danh mục";
      throw new Error(errorMsg);
    }
  },

  restore: async (id) => {
    try {
      const response = await apiClient.put(`/category/${id}/restore`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Khôi phục danh mục thất bại";
      throw new Error(errorMsg);
    }
  },

  hardDelete: async (id) => {
    try {
      const response = await apiClient.delete(`/category/${id}/force`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Xóa vĩnh viễn thất bại";
      throw new Error(errorMsg);
    }
  }
};