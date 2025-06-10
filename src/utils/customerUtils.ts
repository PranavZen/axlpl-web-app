/**
 * Utility functions for customer data handling
 */

import { getUserData } from './authUtils';

/**
 * Debug function to log all available fields in login user data
 * Call this function in browser console to see what fields are available
 */
export const debugLoginUserData = () => {
  try {
    const userData = getUserData();
    console.log('=== LOGIN USER DATA DEBUG ===');
    console.log('Full userData:', userData);
    console.log('Customerdetail:', userData?.Customerdetail);

    if (userData?.Customerdetail) {
      console.log('Available fields in Customerdetail:');
      Object.keys(userData.Customerdetail).forEach(key => {
        console.log(`  ${key}:`, userData.Customerdetail[key]);
      });
    }
    console.log('=== END DEBUG ===');
    return userData;
  } catch (error) {
    console.error('Error in debugLoginUserData:', error);
    return null;
  }
};

interface Customer {
  id: string;
  full_name: string;
  company_name: string;
  pincode: string;
  state_name: string;
  city_name: string;
  area_name: string;
  gst_no: string;
  address1: string;
  address2: string;
  mobile_no: string;
  email: string;
  [key: string]: any;
}

/**
 * Find a customer by full_name from the customers list
 * @param customers Array of customer objects
 * @param fullName The full_name to search for
 * @returns The matching customer object or null if not found
 */
export const findCustomerByName = (customers: Customer[], fullName: string): Customer | null => {
  if (!customers || !Array.isArray(customers) || !fullName) {
    return null;
  }

  return customers.find(customer => customer.full_name === fullName) || null;
};

/**
 * Map login user data to sender fields for existing address
 * @returns Object with mapped field values from logged-in user
 */
export const mapLoginUserToSenderFields = () => {
  try {
    const userData = getUserData();
    const customerDetail = userData?.Customerdetail;

    if (!customerDetail) {
      console.log('No customerDetail found in userData');
      return {};
    }

    // Debug: Log all available fields in customerDetail
    console.log('Available customerDetail fields:', Object.keys(customerDetail));
    console.log('CustomerDetail data:', customerDetail);

    // Map fields based on actual login response structure
    const mappedFields = {
      senderName: customerDetail.name || customerDetail.full_name || customerDetail.customer_name || '',
      senderCompanyName: customerDetail.company_name || customerDetail.name || '',
      senderZipCode: customerDetail.pincode || customerDetail.zip_code || customerDetail.postal_code || '',
      // Use string values from customer data, API will handle conversion or accept strings
      senderState: customerDetail.state_name || customerDetail.state || '',
      senderCity: customerDetail.city_name || customerDetail.city || '',
      // Set area as null since customer data only has area_name (string) not area_id
      // User will need to select from dropdown which provides proper ID/label structure
      senderArea: null,
      senderGstNo: customerDetail.gst_no || customerDetail.gst_number || '',
      senderAddressLine1: customerDetail.reg_address1 || customerDetail.address1 || customerDetail.address || '',
      senderAddressLine2: customerDetail.reg_address2 || customerDetail.address2 || '',
      senderMobile: customerDetail.mobile || customerDetail.mobile_no || customerDetail.phone || '',
      senderEmail: customerDetail.email || customerDetail.email_id || '',
    };

    console.log('Mapped fields for sender:', mappedFields);
    return mappedFields;
  } catch (error) {
    console.error('Error mapping login user to sender fields:', error);
    return {};
  }
};

/**
 * Map customer data to form field values for sender info
 * @param customer The customer object
 * @returns Object with mapped field values
 */
export const mapCustomerToSenderFields = (customer: Customer | null) => {
  if (!customer) {
    return {};
  }

  try {
    return {
      senderName: customer.full_name || '',
      senderCompanyName: customer.company_name || '',
      senderZipCode: customer.pincode || '',
      // Use string values from customer data, API will handle conversion or accept strings
      senderState: customer.state_name || '',
      senderCity: customer.city_name || '',
      // Set area as null since customer data only has area_name (string) not area_id
      // User will need to select from dropdown which provides proper ID/label structure
      senderArea: null,
      senderGstNo: customer.gst_no || '',
      senderAddressLine1: customer.address1 || '',
      senderAddressLine2: customer.address2 || '',
      senderMobile: customer.mobile_no || '',
      senderEmail: customer.email || '',
    };
  } catch (error) {
    console.error('Error mapping customer to sender fields:', error);
    return {};
  }
};

/**
 * Map customer data to form field values for receiver info
 * @param customer The customer object
 * @returns Object with mapped field values
 */
export const mapCustomerToReceiverFields = (customer: Customer | null) => {
  if (!customer) {
    return {};
  }

  try {
    return {
      receiverName: customer.full_name || '',
      receiverCompanyName: customer.company_name || '',
      receiverZipCode: customer.pincode || '',
      // Use string values from customer data, API will handle conversion or accept strings
      receiverState: customer.state_name || '',
      receiverCity: customer.city_name || '',
      // Set area as null since customer data only has area_name (string) not area_id
      // User will need to select from dropdown which provides proper ID/label structure
      receiverArea: null,
      receiverGstNo: customer.gst_no || '',
      receiverAddressLine1: customer.address1 || '',
      receiverAddressLine2: customer.address2 || '',
      receiverMobile: customer.mobile_no || '',
      receiverEmail: customer.email || '',
    };
  } catch (error) {
    console.error('Error mapping customer to receiver fields:', error);
    return {};
  }
};

/**
 * Convert customers array to options format for SingleSelect component
 * @param customers Array of customer objects
 * @returns Array of option objects with value and label
 */
export const customersToOptions = (customers: Customer[]) => {
  if (!customers || !Array.isArray(customers)) {
    return [];
  }

  return customers.map(customer => ({
    value: customer.full_name,
    label: customer.full_name,
  }));
};

/**
 * Convert customers array to options format with login user as first option
 * @param customers Array of customer objects
 * @returns Array of option objects with login user first, then customers
 */
export const customersToOptionsWithLoginUser = (customers: Customer[]) => {
  const options = [];

  try {
    // Add login user as first option
    const userData = getUserData();
    const customerDetail = userData?.Customerdetail;

    if (customerDetail) {
      // Use the correct field name based on login response structure
      const userName = customerDetail.name || customerDetail.full_name || customerDetail.customer_name || 'Your Account';
      options.push({
        value: 'login_user',
        label: `${userName} (Your Account)`,
      });
    }

    // Add other customers
    if (customers && Array.isArray(customers)) {
      const customerOptions = customers.map(customer => ({
        value: customer.full_name,
        label: customer.full_name,
      }));
      options.push(...customerOptions);
    }
  } catch (error) {
    console.error('Error creating customer options with login user:', error);
  }

  return options;
};

/**
 * Get default customer parameters for API call
 * This function extracts the required parameters from user data
 * @returns Object with branch_id, m_id, and next_id
 */
export const getCustomerApiParams = () => {
  // Import getUserData here to avoid circular dependencies
  const getUserData = (): any => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  const userData = getUserData();

  // Extract parameters from user data or use defaults
  // Based on the codebase pattern, we'll use the user ID as m_id
  // and default values for branch_id since the exact source isn't clear
  return {
    branch_id: userData?.Customerdetail?.branch_id || "1", // Use from user data or default
    m_id: userData?.Customerdetail?.id || "1",             // Use user ID as m_id
    next_id: "1",                                          // Start from 1 for pagination
  };
};

/**
 * Get customer parameters for API call with search query
 * @param searchQuery Optional search query to filter customers
 * @returns Object with branch_id, m_id, next_id, and search_query
 */
export const getCustomerApiParamsWithSearch = (searchQuery?: string) => {
  // Import getUserData here to avoid circular dependencies
  const getUserData = (): any => {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  const userData = getUserData();

  const params = {
    branch_id: userData?.Customerdetail?.branch_id || "1",
    m_id: userData?.Customerdetail?.id || "1",
    next_id: "1",
  };

  // Add search_query if provided
  if (searchQuery && searchQuery.trim() !== '') {
    return {
      ...params,
      search_query: searchQuery.trim()
    };
  }

  return params;
};

/**
 * Clear all customer-related form fields for sender
 * @returns Object with empty sender field values
 */
export const clearSenderFields = () => {
  return {
    senderName: '',
    senderCompanyName: '',
    senderZipCode: '',
    senderState: '',
    senderCity: '',
    senderArea: null,
    senderGstNo: '',
    senderAddressLine1: '',
    senderAddressLine2: '',
    senderMobile: '',
    senderEmail: '',
    senderCustomerId: '',
  };
};

/**
 * Clear all customer-related form fields for receiver
 * @returns Object with empty receiver field values
 */
export const clearReceiverFields = () => {
  return {
    receiverName: '',
    receiverCompanyName: '',
    receiverZipCode: '',
    receiverState: '',
    receiverCity: '',
    receiverArea: null,
    receiverGstNo: '',
    receiverAddressLine1: '',
    receiverAddressLine2: '',
    receiverMobile: '',
    receiverEmail: '',
    receiverCustomerId: '',
  };
};

/**
 * Convert areas array to dropdown options
 * @param areas Array of area objects from API
 * @returns Array of option objects for dropdown
 */
export const areasToOptions = (areas: any[]) => {
  return areas.map(area => ({
    value: area.id,
    label: area.name
  }));
};
