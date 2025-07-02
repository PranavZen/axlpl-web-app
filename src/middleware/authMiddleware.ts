import { Middleware } from '@reduxjs/toolkit';
import { isAuthenticated, getUserData } from '../utils/authUtils';
import { logoutLocal } from '../redux/slices/authSlice';
import { clearTrackingData } from '../redux/slices/trackingSlice';

/**
 * Authentication middleware to intercept actions and validate user authentication
 * Automatically logs out users if their session is invalid
 */
export const authMiddleware: Middleware = (store) => (next) => (action : any) => {
  // List of actions that require authentication
  const protectedActions = [
    'tracking/trackShipment/pending',
    'tracking/trackShipment/fulfilled',
    'shipments/fetchAll/pending',
    'shipment/submit/pending',
  ];

  // Check if this is a protected action
  if (protectedActions.some(protectedAction => action.type.startsWith(protectedAction.split('/')[0]))) {
    // Validate authentication before proceeding
    if (!isAuthenticated()) {
      console.warn('Unauthorized action attempted:', action.type);
      
      // Clear any sensitive data
      store.dispatch(clearTrackingData());
      store.dispatch(logoutLocal());
      
      // Redirect to login (this would typically be handled by a router)
      window.location.href = '/';
      
      // Don't proceed with the action
      return;
    }

    // Additional validation for tracking actions
    if (action.type.includes('tracking/trackShipment')) {
      const userData = getUserData();
      const userId = userData?.Customerdetail?.id;
      
      if (!userId) {
        console.warn('User ID not found for tracking action');
        store.dispatch(logoutLocal());
        window.location.href = '/';
        return;
      }
    }
  }

  // Proceed with the action
  return next(action);
};

/**
 * Security middleware to log security-related events
 */
export const securityMiddleware: Middleware = (store) => (next) => (action: any) => {
  // Log security-related actions
  // const securityActions = [
  //   'auth/login',
  //   'auth/logout',
  //   'tracking/trackShipment',
  // ];

  // if (securityActions.some(securityAction => action.type.includes(securityAction))) {
  //   const userData = getUserData();
  //   const timestamp = new Date().toISOString();
    
  //   console.log(`[SECURITY LOG] ${timestamp}:`, {
  //     action: action.type,
  //     user: userData?.Customerdetail?.id || 'anonymous',
  //     payload: action.type.includes('login') ? '[REDACTED]' : action.payload,
  //   });
  // }

  return next(action);
};

/**
 * Rate limiting middleware to prevent abuse
 */
export const rateLimitMiddleware: Middleware = (store) => {
  const actionCounts: { [key: string]: { count: number; lastReset: number } } = {};
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 10;

  return (next) => (action: any) => {
    // Apply rate limiting to tracking actions
    if (action.type.includes('tracking/trackShipment/pending')) {
      const now = Date.now();
      const userId = getUserData()?.Customerdetail?.id || 'anonymous';
      const key = `${userId}_tracking`;

      if (!actionCounts[key]) {
        actionCounts[key] = { count: 0, lastReset: now };
      }

      const timeWindow = actionCounts[key];
      
      // Reset counter if window has passed
      if (now - timeWindow.lastReset > RATE_LIMIT_WINDOW) {
        timeWindow.count = 0;
        timeWindow.lastReset = now;
      }

      // Check if rate limit exceeded
      if (timeWindow.count >= MAX_REQUESTS_PER_WINDOW) {
        console.warn(`Rate limit exceeded for user ${userId}`);
        
        // Create a rejected action
        const rejectedAction = {
          type: 'tracking/trackShipment/rejected',
          payload: 'Too many requests. Please wait a moment before trying again.',
          error: true,
        };
        
        return next(rejectedAction);
      }

      // Increment counter
      timeWindow.count++;
    }

    return next(action);
  };
};

export default authMiddleware;
