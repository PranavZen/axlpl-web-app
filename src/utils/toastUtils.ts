import { toast, ToastOptions } from 'react-toastify';
import { APP_CONFIG } from '../config';

// Default toast options from centralized config
const defaultOptions: ToastOptions = APP_CONFIG.toast;

/**
 * Show a success toast notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

/**
 * Show an error toast notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

/**
 * Show an info toast notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

/**
 * Show a warning toast notification
 * @param message The message to display
 * @param options Additional toast options
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};
