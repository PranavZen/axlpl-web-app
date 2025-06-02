/**
 * Utility functions for customer data handling
 */

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
      senderState: customer.state_name ? { value: customer.state_name, label: customer.state_name } : null,
      senderCity: customer.city_name || '',
      senderArea: customer.area_name ? { value: customer.area_name, label: customer.area_name } : null,
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
      receiverState: customer.state_name ? { value: customer.state_name, label: customer.state_name } : null,
      receiverCity: customer.city_name || '',
      receiverArea: customer.area_name ? { value: customer.area_name, label: customer.area_name } : null,
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
    next_id: "0",                                          // Start from 0 for pagination
  };
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
    senderState: null,
    senderCity: '',
    senderArea: null,
    senderGstNo: '',
    senderAddressLine1: '',
    senderAddressLine2: '',
    senderMobile: '',
    senderEmail: '',
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
    receiverState: null,
    receiverCity: '',
    receiverArea: null,
    receiverGstNo: '',
    receiverAddressLine1: '',
    receiverAddressLine2: '',
    receiverMobile: '',
    receiverEmail: '',
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
