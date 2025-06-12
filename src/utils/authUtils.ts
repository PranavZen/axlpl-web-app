/**
 * Utility functions for handling authentication
 */

/**
 * Get the user data from session storage
 * @returns The user data object or null if not found
 */
export const getUserData = (): any => {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get the authentication token from session storage
 * @returns The authentication token or null if not found
 */
export const getAuthToken = (): string | null => {
  const userData = getUserData();
  return userData?.Customerdetail?.token || null;
};

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated and not a messenger, false otherwise
 */
export const isAuthenticated = (): boolean => {
  // Check if the user has a token
  const hasToken = !!getAuthToken();

  if (!hasToken) {
    return false;
  }

  // Check if the user is a messenger
  const userData = getUserData();
  const userRole = (
    userData?.Customerdetail?.role ||
    userData?.customerdetail?.role ||
    userData?.user?.role ||
    userData?.role ||
    ''
  ).toString().toLowerCase();

  // Return false if the user is a messenger
  if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
    return false;
  }

  return true;
};

/**
 * Set the authentication token in session storage
 * @param userData The user data object containing the token
 * @returns True if the user data was set, false if the user is a messenger
 */
export const setUserData = (userData: any): boolean => {
  // Check if the user is a messenger
  const userRole = (
    userData?.Customerdetail?.role ||
    userData?.customerdetail?.role ||
    userData?.user?.role ||
    userData?.role ||
    ''
  ).toString().toLowerCase();

  // Don't store messenger accounts
  if (userRole === "messenger" || userRole === "messanger" || userRole.includes("mess")) {
    return false;
  }

  // Store the user data
  sessionStorage.setItem('user', JSON.stringify(userData));
  return true;
};

/**
 * Clear the authentication token from session storage
 */
export const clearUserData = (): void => {
  sessionStorage.removeItem('user');
};
