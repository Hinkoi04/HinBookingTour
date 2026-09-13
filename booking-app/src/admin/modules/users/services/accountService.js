import { apiClient } from '../../login/services/authService';

function mapAccount(acc) {
  return {
    id:          acc.id,
    fullName:    acc.fullName,
    email:       acc.email,
    phone:       acc.phone || "",
    avatar:      acc.avatar || "",
    jobTitle:    acc.jobTitle || "",
    roleId:      acc.roleId,
    roleName:    acc.roleName || (acc.roleId === 1 ? "Admin" : "Staff"),
    status:      acc.status,

    createdAt:   acc.createdAt,
    updatedAt:   acc.updatedAt,
    deletedAt:   acc.deletedAt,
    createdBy:   acc.createdBy,
    updatedBy:   acc.updatedBy,
    deletedBy:   acc.deletedBy,
  };
}

export const accountService = {
  getAllActive: async () => {
    try {
      const res = await apiClient.get('/accounts');
      return res.data.map(mapAccount);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách tài khoản thất bại");
    }
  },

  getAllTrash: async () => {
    try {
      const res = await apiClient.get('/accounts/trash');
      return res.data.map(mapAccount);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách thùng rác thất bại");
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/accounts/${id}`);
      return mapAccount(res.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không tìm thấy thông tin tài khoản");
    }
  },

  create: async (payload) => {
    try {
      const res = await apiClient.post('/accounts', payload);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Tạo tài khoản thất bại");
    }
  },

  update: async (id, payload, avatarFile = null) => {
    try {
      const body = new FormData();
      body.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (avatarFile) {
        body.append("file", avatarFile);
      }

      const res = await apiClient.put(`/accounts/${id}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Cập nhật tài khoản thất bại");
    }
  },

  softDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/accounts/${id}`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Chuyển vào thùng rác thất bại");
    }
  },

  restore: async (id) => {
    try {
      const res = await apiClient.put(`/accounts/${id}/restore`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Khôi phục tài khoản thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/accounts/${id}/force`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.response?.data || "Xóa vĩnh viễn thất bại");
    }
  },
};