// ===================================================================
// APPLICATION CONSTANTS
// ===================================================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://new.axlpl.com/messenger/services_v6',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // Authentication
  CHANGE_PASSWORD: '/changePassword',
  
  // Shipments
  GET_SHIPMENTS: '/getShipments',
  ADD_SHIPMENT: '/addShipment',
  UPDATE_SHIPMENT: '/updateShipment',
  DELETE_SHIPMENT: '/deleteShipment',
  GET_ACTIVE_SHIPMENTS: '/getActiveShipments',
  
  // Addresses
  GET_ADDRESSES: '/getAddresses',
  ADD_ADDRESS: '/addAddress',
  UPDATE_ADDRESS: '/updateAddress',
  DELETE_ADDRESS: '/deleteAddress',
  
  // Location Data
  GET_STATES: '/getStates',
  GET_CITIES: '/getCities',
  GET_AREAS: '/getAreas',
  GET_PINCODES: '/getPincodes',
  
  // Master Data
  GET_CATEGORIES: '/getCategories',
  GET_COMMODITIES: '/getCommodities',
  GET_PAYMENT_MODES: '/getPaymentModes',
  GET_SERVICE_TYPES: '/getServiceTypes',
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  PROFILE: '/edit-profile',
  CHANGE_PASSWORD: '/change-password',
  SHIPMENTS: '/shipments',
  ACTIVE_SHIPMENTS: '/shipments/active',
  PENDING_SHIPMENTS: '/shipments/pending',
  DELIVERED_SHIPMENTS: '/shipments/delivered',
  ADD_SHIPMENT: '/add-shipment',
  ADDRESSES: '/customer/addresses',
} as const;

// Shipment Status
export const SHIPMENT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const SHIPMENT_STATUS_LABELS = {
  [SHIPMENT_STATUS.ACTIVE]: 'Active',
  [SHIPMENT_STATUS.PENDING]: 'Pending',
  [SHIPMENT_STATUS.IN_TRANSIT]: 'In Transit',
  [SHIPMENT_STATUS.DELIVERED]: 'Delivered',
  [SHIPMENT_STATUS.CANCELLED]: 'Cancelled',
} as const;

// Address Types
export const ADDRESS_TYPES = {
  SENDER: 'sender',
  RECEIVER: 'receiver',
  BOTH: 'both',
} as const;

export const ADDRESS_TYPE_LABELS = {
  [ADDRESS_TYPES.SENDER]: 'Sender',
  [ADDRESS_TYPES.RECEIVER]: 'Receiver',
  [ADDRESS_TYPES.BOTH]: 'Both',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  AGENT: 'agent',
} as const;

// Form Validation
export const VALIDATION_RULES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_FORMAT: 'Invalid format',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 5,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
} as const;

// Toast Notifications
export const TOAST = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'userData',
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

// Theme Colors
export const COLORS = {
  PRIMARY: '#123458',
  SECONDARY: '#1e4a6b',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  LIGHT: '#f8f9fa',
  DARK: '#212529',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: '0px',
  SM: '576px',
  MD: '768px',
  LG: '992px',
  XL: '1200px',
  XXL: '1400px',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  SHIPMENT_ADDED: 'Shipment added successfully!',
  SHIPMENT_UPDATED: 'Shipment updated successfully!',
  ADDRESS_ADDED: 'Address added successfully!',
  ADDRESS_UPDATED: 'Address updated successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
} as const;
