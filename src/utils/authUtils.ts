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
 * Update user data in session storage with new profile information
 * @param updatedProfileData The updated profile data to merge with existing user data
 * @returns True if the update was successful, false otherwise
 */
export const updateUserDataInSession = (updatedProfileData: any): boolean => {
  try {
    const currentUserData = getUserData();
    if (!currentUserData) {
      return false;
    }

    // Create updated user data by merging the profile data into Customerdetail
    const updatedUserData = {
      ...currentUserData,
      Customerdetail: {
        ...currentUserData.Customerdetail,
        // Map the updated profile fields to the session storage structure
        company_name: updatedProfileData.company_name || currentUserData.Customerdetail?.company_name,
        full_name: updatedProfileData.full_name || updatedProfileData.name || currentUserData.Customerdetail?.full_name,
        name: updatedProfileData.full_name || updatedProfileData.name || currentUserData.Customerdetail?.name,
        email: updatedProfileData.email || currentUserData.Customerdetail?.email,
        mobile: updatedProfileData.mobile_no || currentUserData.Customerdetail?.mobile,
        mobile_no: updatedProfileData.mobile_no || currentUserData.Customerdetail?.mobile_no,
        // Add other relevant fields that might be updated
        pincode: updatedProfileData.pincode || currentUserData.Customerdetail?.pincode,
        state_name: updatedProfileData.state_name || currentUserData.Customerdetail?.state_name,
        city_name: updatedProfileData.city_name || currentUserData.Customerdetail?.city_name,
        area_name: updatedProfileData.area_name || currentUserData.Customerdetail?.area_name,
        gst_no: updatedProfileData.gst_no || currentUserData.Customerdetail?.gst_no,
        reg_address1: updatedProfileData.reg_address1 || currentUserData.Customerdetail?.reg_address1,
        reg_address2: updatedProfileData.reg_address2 || currentUserData.Customerdetail?.reg_address2,
        // Profile image path
        cust_profile_img: updatedProfileData.cust_profile_img || currentUserData.Customerdetail?.cust_profile_img,
        path: updatedProfileData.path || currentUserData.Customerdetail?.path,
      }
    };

    // Store the updated user data
    sessionStorage.setItem('user', JSON.stringify(updatedUserData));
    return true;
  } catch (error) {
    console.error('Error updating user data in session storage:', error);
    return false;
  }
};

/**
 * Clear the authentication token from session storage
 */
export const clearUserData = (): void => {
  sessionStorage.removeItem('user');
};
