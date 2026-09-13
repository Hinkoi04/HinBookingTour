import { apiClient } from '../../login/services/authService';

export const roleService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/roles');
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách phân quyền thất bại");
    }
  },
};