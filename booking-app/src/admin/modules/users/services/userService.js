import { apiClient } from '../../login/services/authService';

function mapUser(user) {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone || "—",

    totalBookings: user.totalBookings || 0,
    totalSpent: user.totalSpent || 0,

    status: user.status,
    joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : "—",

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userService = {
  getAllActive: async () => {
    try {
      const res = await apiClient.get('/user');
      return res.data.map(mapUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách khách hàng thất bại");
    }
  },

  getAllTrash: async () => {
    try {
      const res = await apiClient.get('/user/trash');
      return res.data.map(mapUser);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách thùng rác thất bại");
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/user/${id}`);
      return mapUser(res.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không tìm thấy thông tin khách hàng");
    }
  },

  create: async () => {
    throw new Error("Chức năng tạo tài khoản khách hàng hiện chưa được hỗ trợ");
  },

  update: async (id, payload) => {
    try {
      const res = await apiClient.put(`/user/${id}`, payload);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Cập nhật tài khoản thất bại");
    }
  },

  softDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/user/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Khóa tài khoản thất bại");
    }
  },

  restore: async (id) => {
    try {
      const res = await apiClient.put(`/user/${id}/restore`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Mở khóa tài khoản thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/user/${id}/force`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa vĩnh viễn thất bại");
    }
  },
};