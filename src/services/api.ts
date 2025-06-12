// ===================================================================
// API SERVICE CONFIGURATION
// ===================================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';
import { getUserData } from '../utils/authUtils';
import { showError } from '../utils/toastUtils';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userData = getUserData();
    const token = userData?.Customerdetail?.token || userData?.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          showError(ERROR_MESSAGES.UNAUTHORIZED);
          // Redirect to login or clear auth data
          localStorage.clear();
          window.location.href = '/';
          break;
        case 403:
          showError(ERROR_MESSAGES.FORBIDDEN);
          break;
        case 404:
          showError(ERROR_MESSAGES.NOT_FOUND);
          break;
        case 500:
          showError(ERROR_MESSAGES.SERVER_ERROR);
          break;
        default:
          showError(data?.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } else if (error.request) {
      // Network error
      showError(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Other error
      showError(ERROR_MESSAGES.GENERIC_ERROR);
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // Upload file
  upload: async <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// Export the configured axios instance for direct use if needed
export default apiClient;
