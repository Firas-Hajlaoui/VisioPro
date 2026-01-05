import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { transformBackendResponse, transformFrontendRequest } from './utils/dataTransform';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Token management utilities
const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

const clearTokens = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Transform request data from camelCase to snake_case
        if (config.data && typeof config.data === 'object') {
            config.data = transformFrontendRequest(config.data);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh and transform response data
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Transform response data from snake_case to camelCase
        if (response.data) {
            response.data = transformBackendResponse(response.data);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                // No refresh token available, logout
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Call refresh endpoint without transformation
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh/`,
                    { refresh: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { access, refresh } = response.data;
                setTokens(access, refresh || refreshToken);

                // Update failed queue
                processQueue(null, access);

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                processQueue(refreshError, null);
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Export API instance and utilities
export { api, getAccessToken, getRefreshToken, setTokens, clearTokens };
export default api;
