import { apiClient } from "../../login/services/authService"; 

export const getDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard/summary');
  
    return response.data.data || response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard từ Server:", error);
    throw error;
  }
};