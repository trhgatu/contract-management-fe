import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // Handle unauthorized errors
            if (status === 401) {
                // Clear auth data
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_info');

                // Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }

            // Handle forbidden errors
            if (status === 403) {
                console.error('Access forbidden:', error.response.data.message);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
