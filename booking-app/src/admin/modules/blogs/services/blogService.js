import { apiClient } from '../../login/services/authService';

export const blogService = {
  getAll: async () => (await apiClient.get('/blogs')).data,
  getById: async (id) => (await apiClient.get(`/blogs/${id}`)).data,
  getAllTrash: async () => (await apiClient.get('/blogs/trash')).data,

  create: async (payload, thumbnailFile) => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    
    if (thumbnailFile) {
      formData.append("image", thumbnailFile);
    }

    const response = await apiClient.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, payload, thumbnailFile) => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    
    if (thumbnailFile) {
      formData.append("image", thumbnailFile);
    }

    const response = await apiClient.put(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  softDelete: async (id) => (await apiClient.delete(`/blogs/${id}`)).data,
  restore: async (id) => (await apiClient.put(`/blogs/${id}/restore`)).data,
  hardDelete: async (id) => (await apiClient.delete(`/blogs/${id}/force`)).data
};