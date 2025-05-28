import { FCM_TOKEN, API_BASE_URL, APP_CONFIG } from '../config';

/**
 * Custom hook to access application configuration
 * This provides a convenient way to access configuration values throughout the app
 */
export const useConfig = () => {
  return {
    fcmToken: FCM_TOKEN,
    apiBaseUrl: API_BASE_URL,
    toastConfig: APP_CONFIG.toast,
  };
};

export default useConfig;
