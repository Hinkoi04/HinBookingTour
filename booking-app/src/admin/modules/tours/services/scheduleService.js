import { apiClient } from '../../login/services/authService'; 

export const getSchedulesByTourId = async (tourId) => {
    try {
        const response = await apiClient.get(`/schedules/tour/${tourId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi kết nối khi tải dữ liệu lộ trình" };
    }
};

export const saveSchedules = async (tourId, schedules) => {
    try {
        const response = await apiClient.post(`/schedules/tour/${tourId}`, schedules);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi kết nối khi lưu lộ trình" };
    }
};