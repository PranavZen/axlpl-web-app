import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../../utils/authUtils';
import SecurityNotice from '../ui/security/SecurityNotice';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
  showLoadingSpinner?: boolean;
}

/**
 * AuthGuard component to protect routes and ensure only authenticated users
 * with proper permissions can access protected content
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/',
  allowedRoles = [],
  showLoadingSpinner = true
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // If authentication is not required, allow access
        if (!requireAuth) {
          setIsChecking(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
          setAuthError('Authentication required. Please log in to access this page.');
          setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 3000);
          return;
        }

        // Get user data for role validation
        const userData = getUserData();
        const userRole = userData?.Customerdetail?.role?.toLowerCase();
        const userId = userData?.Customerdetail?.id;

        if (!userId) {
          setAuthError('User information not found. Please log in again.');
          setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 3000);
          return;
        }

        // Check role-based access if roles are specified
        if (allowedRoles.length > 0 && userRole) {
          const hasValidRole = allowedRoles.some(role => 
            role.toLowerCase() === userRole
          );

          if (!hasValidRole) {
            setAuthError(`Access denied. Your account role (${userRole}) is not authorized to access this page.`);
            setTimeout(() => {
              navigate(redirectTo, { replace: true });
            }, 3000);
            return;
          }
        }

        // Additional security checks for specific roles
        if (userRole === 'messenger' || userRole === 'messanger' || userRole?.includes('mess')) {
          setAuthError('Messenger accounts are not allowed to access shipment tracking.');
          setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 3000);
          return;
        }

        // Log successful authentication check
        // console.log(`[AUTH GUARD] Access granted for user ${userId} with role ${userRole}`);
        
        setIsChecking(false);
      } catch (error) {
        console.error('[AUTH GUARD] Authentication check failed:', error);
        setAuthError('Authentication verification failed. Please try again.');
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 3000);
      }
    };

    checkAuthentication();
  }, [requireAuth, redirectTo, allowedRoles, navigate]);

  // Show loading state while checking authentication
  if (isChecking && showLoadingSpinner) {
    return (
      <div className="auth-guard-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (authError) {
    return (
      <div className="auth-guard-error">
        <SecurityNotice
          type="warning"
          title="Access Restricted"
          message={authError}
          showUserInfo={false}
        />
        <div className="redirect-notice">
          <p>Redirecting to login page...</p>
          <div className="loading-spinner small"></div>
        </div>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

/**
 * Higher-order component for protecting routes
 */
export const withAuthGuard = (
  Component: React.ComponentType<any>,
  options: Omit<AuthGuardProps, 'children'> = {}
) => {
  return (props: any) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};

/**
 * Hook for checking authentication status in components
 */
export const useAuthGuard = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null as any,
    error: null as string | null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = isAuthenticated();
        const userData = getUserData();

        setAuthStatus({
          isAuthenticated: isAuth,
          isLoading: false,
          user: userData,
          error: null,
        });
      } catch (error) {
        setAuthStatus({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Authentication check failed',
        });
      }
    };

    checkAuth();
  }, []);

  return authStatus;
};

export default AuthGuard;
