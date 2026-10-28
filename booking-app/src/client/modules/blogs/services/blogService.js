import { apiClient } from "../../../services/apiClient";

export const blogService = {
  getAll: async () => {
    const response = await apiClient.get("/blogs");
    if (!Array.isArray(response.data)) {
      throw new Error("Dữ liệu cẩm nang không hợp lệ");
    }
    return response.data;
  },

  getBySlug: async (slug) => {
    const blogs = await blogService.getAll();
    const blog = blogs.find(
      (item) => item.slug === slug || String(item.id) === slug
    );
    if (!blog) return null;

    const response = await apiClient.get(`/blogs/${blog.id}`);
    return response.data;
  },
};

export default blogService;
