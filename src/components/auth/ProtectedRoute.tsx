import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { isAuthenticated, getUserData } from '../../utils/authUtils';
import { logoutLocal } from '../../redux/slices/authSlice';
import { showError } from '../../utils/toastUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user is authenticated using the utility function
  const userAuthenticated = isAuthenticated() || !!user;

  // If not authenticated, redirect to login page
  if (!userAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
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
