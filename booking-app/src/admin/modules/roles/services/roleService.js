import { apiClient } from "../../login/services/authService";


export const roleService = {
  getAll: async () => {
    const response = await apiClient.get('/roles');
    return response.data.data || response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data.data || response.data;
  },
  
  create: async (payload) => {
    const response = await apiClient.post('/roles', payload);
    return response.data;
  },
  
  update: async (id, payload) => {
    const response = await apiClient.put(`/roles/${id}`, payload);
    return response.data;
  },
  
  lock: async (id) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
  
  unlock: async (id) => {
    const response = await apiClient.put(`/roles/${id}/restore`, {});
    return response.data;
  },
  
  updatePermissions: async (id, permissionIds) => {
    const response = await apiClient.put(`/roles/${id}/permissions`, { permissionIds });
    return response.data;
  }
};


export const permissionService = {
  getAll: async () => {
    const response = await apiClient.get('/permissions');
    return response.data.data || response.data;
  }
};