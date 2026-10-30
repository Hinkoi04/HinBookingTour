import axios from 'axios';
import { API_BASE_URL } from '../../../../services/apiConfig';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
                        window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

export const loginService = async (email, password) => {
    try {
        const response = await apiClient.post('/admin/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi kết nối server" };
    }
};

export const changePasswordService = async (currentPassword, newPassword) => {
    try {
        const response = await apiClient.post('/admin/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        const responseData = error.response?.data;
        const message = responseData?.message ||
            (typeof responseData === "string" ? responseData : null) ||
            error.message ||
            "Đổi mật khẩu thất bại";
        throw new Error(message);
    }
};

export const getMeService = async () => {
    try {
        const response = await apiClient.get('/admin/auth/me');
        
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("userId", response.data.id);
                localStorage.setItem("roleName", response.data.role); 
        
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Lỗi lấy thông tin user" };
    }
};
const handleAuthSuccess = (authData) => {
    localStorage.setItem("accessToken", authData.accessToken);
    if (authData.user) {
        localStorage.setItem("user", JSON.stringify(authData.user));
    }
};