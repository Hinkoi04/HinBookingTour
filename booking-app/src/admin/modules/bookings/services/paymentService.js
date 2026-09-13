import { apiClient } from "../../login/services/authService";

export const paymentService = {
    confirmPayment: async (paymentId) => {
    const response = await apiClient.put(`/payments/${paymentId}/confirm`);
    return response.data.data;
    },
    updateStatus: async (paymentId, statusValue) => {
        const response = await apiClient.put(`/payments/${paymentId}/status`, { 
            status: statusValue 
        });
        return response.data.data;
    }
};