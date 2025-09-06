import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth APIs
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (name: string, email: string, password: string) =>
        api.post('/auth/register', { name, email, password }),

    getMe: () => api.get('/auth/me'),
};

// Items APIs
export const itemsAPI = {
    getItems: (params?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sort?: string;
    }) => api.get('/items', { params }),

    getItem: (id: string) => api.get(`/items/${id}`),

    createItem: (itemData: any) => api.post('/items', itemData),

    updateItem: (id: string, itemData: any) => api.put(`/items/${id}`, itemData),

    deleteItem: (id: string) => api.delete(`/items/${id}`),
};

// Cart APIs
export const cartAPI = {
    getCart: () => api.get('/cart'),

    addToCart: (itemId: string, quantity: number = 1) =>
        api.post('/cart', { itemId, quantity }),

    updateCartItem: (itemId: string, quantity: number) =>
        api.put(`/cart/${itemId}`, { quantity }),

    removeFromCart: (itemId: string) => api.delete(`/cart/${itemId}`),

    clearCart: () => api.delete('/cart'),
};

export default api;