import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { isAuthenticated, getUserData } from '../../utils/authUtils';
import { logoutLocal, restoreUser } from '../../redux/slices/authSlice';
import { showError } from '../../utils/toastUtils';
import { LogisticsLoader } from '../ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationAttempted, setRestorationAttempted] = useState(false);

  // Restore user data from sessionStorage if Redux state is empty but sessionStorage has data
  useEffect(() => {
    console.log('🔍 ProtectedRoute useEffect:', {
      hasUser: !!user,
      restorationAttempted,
      isAuthenticated: isAuthenticated(),
      userIdFromRedux: user?.Customerdetail?.id
    });

    if (!user && !restorationAttempted && isAuthenticated()) {
      console.log('🔄 ProtectedRoute: Restoring user from sessionStorage...');
      setIsRestoring(true);
      dispatch(restoreUser());
      setRestorationAttempted(true);
      // Give a small delay to ensure the Redux state is updated
      setTimeout(() => {
        setIsRestoring(false);
        console.log('✅ ProtectedRoute: User restoration completed');
      }, 100);
    } else if (!user && !isAuthenticated()) {
      // No user data in sessionStorage, mark restoration as attempted
      console.log('❌ ProtectedRoute: No authentication data found');
      setRestorationAttempted(true);
    } else if (user && !restorationAttempted) {
      // User already exists in Redux, no need to restore
      console.log('✅ ProtectedRoute: User already exists in Redux');
      setRestorationAttempted(true);
    }
  }, [user, dispatch, restorationAttempted]);

  // Show loading while restoring user data
  if (isRestoring) {
    return <LogisticsLoader />;
  }

  // Check if user is authenticated using the utility function
  const userAuthenticated = isAuthenticated() || !!user;

  // Only check authentication after restoration has been attempted
  if (restorationAttempted && !userAuthenticated) {
    console.log('❌ ProtectedRoute: User not authenticated after restoration attempt');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If restoration hasn't been attempted yet, show loading
  if (!restorationAttempted) {
    return <LogisticsLoader />;
  }

  // Get user data from session storage
  const userData = getUserData();

  // Check if the user has the role "messenger"
  const userRole = (
    userData?.Customerdetail?.role ||
    userData?.customerdetail?.role ||
    userData?.user?.role ||
    userData?.role ||
    ''
  ).toString().toLowerCase();

  // If the user is a messenger, log them out and redirect to login page
  if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
    // Log out the user (local logout for security)
    dispatch(logoutLocal());
    // Show error message
    showError("Messenger accounts are not allowed to access this application. Please contact support.");
    // Redirect to login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated and not a messenger, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
