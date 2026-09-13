import { apiClient } from '../../login/services/authService';

function mapTour(tour) {
  return {
    id:          tour.id,
    name:        tour.title,
    image:       tour.thumbnail,
    images:      tour.images || [], 
    duration:    tour.time,
    categoryId:  tour.categoryId,
    category:    "", 
    description: tour.description,
    status:      tour.status,    
    schedules:   tour.schedules,  
    createdAt:   tour.createdAt,
    updatedAt:   tour.updatedAt,
    createdBy:   tour.createdBy,
    updatedBy:   tour.updatedBy,
    deletedAt:   tour.deletedAt,
    deletedBy:   tour.deletedBy,
    deleted:     tour.deleted,
  };
}

export const tourService = {
  
  getCategories: async () => {
    try {
      const res = await apiClient.get('/category');
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách danh mục thất bại");
    }
  },

  getAll: async () => {
    try {
      const res = await apiClient.get('/tour');
      return res.data.map(mapTour);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách tour thất bại");
    }
  },

  getAllActive: async () => {
    try {
      const res = await apiClient.get('/tour');
      return res.data.map(mapTour);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách tour thất bại");
    }
  },

  getAllTrash: async () => {
    try {
      const res = await apiClient.get('/tour/trash');
      return res.data.map(mapTour);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lấy danh sách thùng rác thất bại");
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/tour/${id}`);
      return mapTour(res.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Không tìm thấy tour");
    }
  },

  create: async (payload, imageFile, galleryImages = []) => {
    try {
      const body = new FormData();
      body.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (imageFile) body.append("file", imageFile);
      
      if (galleryImages && galleryImages.length > 0) {
        galleryImages.forEach(img => {
          body.append("images", img);
        });
      }

      const res = await apiClient.post('/tour', body, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Tạo tour thất bại");
    }
  },

  update: async (id, payload, imageFile, galleryImages = []) => {
    try {
      const body = new FormData();
      const { existingImages = [], ...restPayload } = payload;
      body.append("data", new Blob([JSON.stringify(restPayload)], { type: "application/json" }));

      if (imageFile) body.append("file", imageFile);

      if (galleryImages && galleryImages.length > 0) {
        galleryImages.forEach(img => body.append("images", img));
      }

      if (existingImages.length > 0) {
        existingImages.forEach(url => body.append("existingImageUrls", url));
      }
      const res = await apiClient.put(`/tour/${id}`, body, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Cập nhật tour thất bại");
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/tour/${id}`);
      return res.data;
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data;
      throw new Error(backendMessage || "Có lỗi xảy ra khi xóa Tour");
    }
  },

  softDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/tour/${id}`);
      return res.data;
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data;
      throw new Error(backendMessage || "Xóa tour thất bại");
    }
  },

  restore: async (id) => {
    try {
      const res = await apiClient.put(`/tour/${id}/restore`, {});
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Khôi phục tour thất bại");
    }
  },

  hardDelete: async (id) => {
    try {
      const res = await apiClient.delete(`/tour/${id}/force`);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Xóa vĩnh viễn thất bại");
    }
  }
};