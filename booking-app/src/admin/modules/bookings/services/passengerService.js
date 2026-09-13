import { apiClient } from "../../login/services/authService";

export const passengerService = {
    getByBookingId: async (bookingId) => {
        const response = await apiClient.get(`/passengers/booking/${bookingId}`);
        return response.data.data;
    },
    update: async (passengerId, passengerData) => {
        const response = await apiClient.put(`/passengers/${passengerId}`, passengerData);
        return response.data.data;
    }
};