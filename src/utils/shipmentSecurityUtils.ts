import { getUserData, isAuthenticated } from './authUtils';

/**
 * Interface for shipment ownership validation
 */
interface ShipmentOwnershipResult {
  isOwner: boolean;
  reason?: string;
  userId?: string;
  shipmentUserId?: string;
}

/**
 * Interface for shipment data that might contain user/owner information
 */
interface ShipmentData {
  user_id?: string | number;
  customer_id?: string | number;
  sender_id?: string | number;
  created_by?: string | number;
  owner_id?: string | number;
  [key: string]: any;
}

/**
 * Validates if the current user owns/has access to a specific shipment
 * @param shipmentData - The shipment data object
 * @returns ShipmentOwnershipResult indicating ownership status
 */
export const validateShipmentOwnership = (shipmentData: ShipmentData): ShipmentOwnershipResult => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return {
      isOwner: false,
      reason: 'User is not authenticated',
    };
  }

  const userData = getUserData();
  const currentUserId = userData?.Customerdetail?.id;

  if (!currentUserId) {
    return {
      isOwner: false,
      reason: 'Current user ID not found',
    };
  }

  // Try to find the shipment owner ID from various possible fields
  const possibleOwnerFields = [
    'user_id',
    'customer_id', 
    'sender_id',
    'created_by',
    'owner_id'
  ];

  let shipmentUserId: string | number | undefined;

  for (const field of possibleOwnerFields) {
    if (shipmentData[field]) {
      shipmentUserId = shipmentData[field];
      break;
    }
  }

  if (!shipmentUserId) {
    return {
      isOwner: false,
      reason: 'Shipment owner ID not found in data',
      userId: currentUserId.toString(),
    };
  }

  // Compare user IDs (convert to strings for comparison)
  const isOwner = currentUserId.toString() === shipmentUserId.toString();

  return {
    isOwner,
    reason: isOwner ? 'User owns this shipment' : 'User does not own this shipment',
    userId: currentUserId.toString(),
    shipmentUserId: shipmentUserId.toString(),
  };
};

/**
 * Validates if a shipment ID format is valid
 * @param shipmentId - The shipment ID to validate
 * @returns boolean indicating if the format is valid
 */
export const validateShipmentIdFormat = (shipmentId: string): boolean => {
  if (!shipmentId || typeof shipmentId !== 'string') {
    return false;
  }

  const trimmedId = shipmentId.trim();
  
  // Basic validation: should be at least 3 characters and contain alphanumeric characters
  if (trimmedId.length < 3) {
    return false;
  }

  // Check if it contains only valid characters (letters, numbers, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9\-_]+$/;
  return validPattern.test(trimmedId);
};

/**
 * Sanitizes a shipment ID by removing invalid characters
 * @param shipmentId - The shipment ID to sanitize
 * @returns Sanitized shipment ID
 */
export const sanitizeShipmentId = (shipmentId: string): string => {
  if (!shipmentId || typeof shipmentId !== 'string') {
    return '';
  }

  return shipmentId
    .trim()
    .replace(/[^a-zA-Z0-9\-_]/g, '') // Remove invalid characters
    .toUpperCase(); // Convert to uppercase for consistency
};

/**
 * Checks if the current user has permission to perform tracking operations
 * @returns Object with permission status and user info
 */
export const checkTrackingPermissions = () => {
  if (!isAuthenticated()) {
    return {
      hasPermission: false,
      reason: 'Authentication required',
      redirectToLogin: true,
    };
  }

  const userData = getUserData();
  const userId = userData?.Customerdetail?.id;
  const userRole = userData?.Customerdetail?.role?.toLowerCase();

  if (!userId) {
    return {
      hasPermission: false,
      reason: 'User information not found',
      redirectToLogin: true,
    };
  }

  // Check if user role is allowed (exclude messenger accounts)
  if (userRole === 'messenger' || userRole === 'messanger' || userRole?.includes('mess')) {
    return {
      hasPermission: false,
      reason: 'Messenger accounts are not allowed to track shipments',
      redirectToLogin: true,
    };
  }

  return {
    hasPermission: true,
    userId,
    userName: userData?.Customerdetail?.name || userData?.Customerdetail?.company_name,
    userEmail: userData?.Customerdetail?.email,
  };
};

/**
 * Logs security events for audit purposes
 * @param event - The security event type
 * @param details - Additional details about the event
 */
export const logSecurityEvent = (event: string, details: any = {}) => {
  const userData = getUserData();
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    event,
    userId: userData?.Customerdetail?.id || 'anonymous',
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...details,
  };

  // In a production environment, this would be sent to a logging service
  console.log('[SECURITY EVENT]', logEntry);
  
  // Store in session storage for debugging (remove in production)
  const existingLogs = JSON.parse(sessionStorage.getItem('securityLogs') || '[]');
  existingLogs.push(logEntry);
  
  // Keep only the last 50 logs
  if (existingLogs.length > 50) {
    existingLogs.splice(0, existingLogs.length - 50);
  }
  
  sessionStorage.setItem('securityLogs', JSON.stringify(existingLogs));
};

/**
 * Creates a secure error message that doesn't reveal sensitive information
 * @param originalError - The original error message
 * @param isOwnershipError - Whether this is an ownership-related error
 * @returns User-friendly error message
 */
export const createSecureErrorMessage = (originalError: string, isOwnershipError: boolean = false): string => {
  const lowerError = originalError.toLowerCase();

  if (isOwnershipError || lowerError.includes('not authorized') || lowerError.includes('access denied')) {
    return 'You can only track shipments that belong to your account. Please verify the shipment ID.';
  }

  if (lowerError.includes('not found')) {
    return 'Shipment not found. Please check the shipment ID and ensure it belongs to your account.';
  }

  if (lowerError.includes('authentication') || lowerError.includes('session')) {
    return 'Your session has expired. Please log in again to track your shipments.';
  }

  // For other errors, return a generic message to avoid information disclosure
  return 'Unable to retrieve shipment information. Please try again or contact support.';
};

export default {
  validateShipmentOwnership,
  validateShipmentIdFormat,
  sanitizeShipmentId,
  checkTrackingPermissions,
  logSecurityEvent,
  createSecureErrorMessage,
};
