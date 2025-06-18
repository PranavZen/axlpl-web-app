import { useState, useCallback } from 'react';
import { getUserData, isAuthenticated } from '../utils/authUtils';

interface ShipmentSecurityState {
  isValidating: boolean;
  isAuthorized: boolean;
  error: string | null;
  userId: string | null;
  userName: string | null;
}

interface ShipmentSecurityHook extends ShipmentSecurityState {
  validateShipmentAccess: (shipmentId: string, shipmentData?: any) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing shipment security and user authorization
 * Provides methods to validate if a user can access specific shipments
 */
export const useShipmentSecurity = (): ShipmentSecurityHook => {
  const [state, setState] = useState<ShipmentSecurityState>({
    isValidating: false,
    isAuthorized: false,
    error: null,
    userId: null,
    userName: null,
  });

  /**
   * Initialize user data
   */
  const initializeUser = useCallback(() => {
    const userData = getUserData();
    const userId = userData?.Customerdetail?.id;
    const userName = userData?.Customerdetail?.name || userData?.Customerdetail?.company_name || 'User';
    
    return { userId, userName, userData };
  }, []);

  /**
   * Validate if the current user can access a specific shipment
   */
  const validateShipmentAccess = useCallback(async (
    shipmentId: string, 
    shipmentData?: any
  ): Promise<boolean> => {
    setState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setState(prev => ({
          ...prev,
          isValidating: false,
          isAuthorized: false,
          error: 'Authentication required. Please log in to track your shipments.',
        }));
        return false;
      }

      const { userId, userName } = initializeUser();

      if (!userId) {
        setState(prev => ({
          ...prev,
          isValidating: false,
          isAuthorized: false,
          error: 'User information not found. Please log in again.',
        }));
        return false;
      }

      // Basic shipment ID validation
      if (!shipmentId || shipmentId.trim().length < 3) {
        setState(prev => ({
          ...prev,
          isValidating: false,
          isAuthorized: false,
          error: 'Please enter a valid shipment ID.',
        }));
        return false;
      }

      // If shipment data is provided, validate ownership
      if (shipmentData) {
        const shipmentUserId = shipmentData.user_id || 
                              shipmentData.customer_id ||
                              shipmentData.sender_id ||
                              shipmentData.created_by;

        if (shipmentUserId && shipmentUserId.toString() !== userId.toString()) {
          setState(prev => ({
            ...prev,
            isValidating: false,
            isAuthorized: false,
            error: 'Access denied. This shipment does not belong to your account.',
          }));
          return false;
        }
      }

      // If all validations pass
      setState(prev => ({
        ...prev,
        isValidating: false,
        isAuthorized: true,
        userId,
        userName,
        error: null,
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isValidating: false,
        isAuthorized: false,
        error: 'An error occurred while validating shipment access.',
      }));
      return false;
    }
  }, [initializeUser]);

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Reset the entire state
   */
  const reset = useCallback(() => {
    setState({
      isValidating: false,
      isAuthorized: false,
      error: null,
      userId: null,
      userName: null,
    });
  }, []);

  return {
    ...state,
    validateShipmentAccess,
    clearError,
    reset,
  };
};

/**
 * Utility function to check if an error is security-related
 */
export const isSecurityError = (error: string): boolean => {
  const securityKeywords = [
    'not authorized',
    'access denied',
    'permission',
    'unauthorized',
    'authentication required',
    'session has expired',
    'invalid credentials',
    'forbidden'
  ];

  return securityKeywords.some(keyword => 
    error.toLowerCase().includes(keyword.toLowerCase())
  );
};

/**
 * Utility function to get user-friendly security error messages
 */
export const getSecurityErrorMessage = (error: string): string => {
  const lowerError = error.toLowerCase();

  if (lowerError.includes('not authorized') || lowerError.includes('access denied')) {
    return 'You are not authorized to access this shipment. You can only track shipments that belong to your account.';
  }

  if (lowerError.includes('authentication required') || lowerError.includes('session has expired')) {
    return 'Your session has expired. Please log in again to track your shipments.';
  }

  if (lowerError.includes('permission') || lowerError.includes('forbidden')) {
    return 'You do not have permission to access this shipment. Please verify the shipment ID belongs to your account.';
  }

  return error;
};

export default useShipmentSecurity;
