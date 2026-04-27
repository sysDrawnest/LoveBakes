import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('lovebakes_user');
    if (user) {
        const { token } = JSON.parse(user);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const registerApi = (data) => api.post('/auth/register', data);
export const loginApi = (data) => api.post('/auth/login', data);
export const getProfileApi = () => api.get('/auth/profile');
export const updateProfileApi = (data) => api.put('/auth/profile', data);

// Products
export const getProductsApi = (params) => api.get('/products', { params });
export const getFeaturedProductsApi = () => api.get('/products/featured');
export const getProductByIdApi = (id) => api.get(`/products/${id}`);
export const createProductApi = (data) => api.post('/products', data);
export const updateProductApi = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);

// Orders
export const createOrderApi = (data) => api.post('/orders', data);
export const getMyOrdersApi = () => api.get('/orders/myorders');
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);
export const getAllOrdersApi = (params) => api.get('/orders/admin', { params });
export const updateOrderStatusApi = (id, data) => api.put(`/orders/${id}/status`, data);

// Custom Orders
export const createCustomOrderApi = (data) => api.post('/custom-orders', data);
export const getMyCustomOrdersApi = () => api.get('/custom-orders/mine');
export const getAllCustomOrdersApi = () => api.get('/custom-orders/admin');
export const approveCustomOrderApi = (id, data) => api.put(`/custom-orders/${id}/approve`, data);

// Admin
export const getAnalyticsApi = () => api.get('/admin/analytics');
export const getAllUsersApi = () => api.get('/admin/users');

// Contact
export const sendMessageApi = (data) => api.post('/contact', data);

// Payment
export const createRazorpayOrderApi = (data) => api.post('/payment/create-order', data);
export const verifyPaymentApi = (data) => api.post('/payment/verify', data);

export default api;
