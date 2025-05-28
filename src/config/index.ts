/**
 * Application configuration
 * This file centralizes all environment variables and configuration settings
 */

// Firebase Cloud Messaging token
export const FCM_TOKEN = process.env.REACT_APP_FCM_TOKEN || '';

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://new.axlpl.com/messenger/services_v6';

// Other configuration settings can be added here
export const APP_CONFIG = {
  // Toast notification settings
  toast: {
    position: 'top-right' as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored' as const,
  },
};
