import { apiClient } from "../../login/services/authService"; 

export const getDashboardData = async (period, date) => {
  try {
    const response = await apiClient.get('/dashboard/summary', {
      params: { period, date },
    });
  
    return response.data.data || response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard từ Server:", error);
    throw error;
  }
};