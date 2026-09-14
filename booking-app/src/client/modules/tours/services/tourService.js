import { apiClient } from "../../../services/apiClient";
import { mapTour } from "../../home/services/homeService";

export const tourService = {
  getTourById: async (id) => {
    try {
      const [tourRes, catRes, depRes, revRes] = await Promise.allSettled([
        apiClient.get(`/tour/${id}`),
        apiClient.get("/category"),
        apiClient.get("/departure"),
        apiClient.get(`/reviews/tour/${id}`),
      ]);

      let rawTour = null;
      if (tourRes.status === "fulfilled" && tourRes.value.data) {
        rawTour = tourRes.value.data;
      }

      const categories = catRes.status === "fulfilled" ? catRes.value.data : [];
      const departures = depRes.status === "fulfilled" ? depRes.value.data : [];
      const reviews = revRes.status === "fulfilled" ? revRes.value.data : [];

      if (rawTour) {
        const mapped = mapTour(rawTour, categories, departures);
        if (Array.isArray(reviews) && reviews.length > 0) {
          mapped.apiReviews = reviews.map((r) => ({
            id: r.id,
            tourId: r.tourId,
            author: r.userFullName || "Khách hàng TravelGo",
            rating: r.rating || 5,
            date: r.createdAt ? r.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            comment: r.content || "",
          }));
        }
        return mapped;
      }
      return null;
    } catch (error) {
      console.error(`Lỗi khi tải chi tiết tour ${id}:`, error);
      return null;
    }
  },

  getReviewsByTour: async (tourId) => {
    try {
      const res = await apiClient.get(`/reviews/tour/${tourId}`);
      if (Array.isArray(res.data)) {
        return res.data.map((r) => ({
          id: r.id,
          tourId: r.tourId,
          author: r.userFullName || "Khách hàng",
          avatar: "",
          rating: r.rating || 5,
          date: r.createdAt ? r.createdAt.split("T")[0] : "",
          comment: r.content || "",
        }));
      }
      return [];
    } catch (error) {
      console.error("Lỗi khi tải đánh giá tour:", error);
      return [];
    }
  },

  submitReview: async (payload) => {
    try {
      const res = await apiClient.post("/reviews", payload);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      return { success: true };
    }
  },
};
