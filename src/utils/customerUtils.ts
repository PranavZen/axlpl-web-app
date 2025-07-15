/**
 * Utility functions for customer data handling
 */

import { getUserData } from "./authUtils";

/**
 * Debug function to log all available fields in login user data
 * Call this function in browser console to see what fields are available
 */
export const debugLoginUserData = () => {
  try {
    const userData = getUserData();
    return userData;
  } catch (error) {
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
  state_id?: string;
  city_id?: string;
  area_id?: string;
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
export const findCustomerByName = (
  customers: Customer[],
  fullName: string
): Customer | null => {
  if (!customers || !Array.isArray(customers) || !fullName) {
    return null;
  }

  return customers.find((customer) => customer.full_name === fullName) || null;
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
      return {};
    }

    // Map fields based on actual login response structure
    const mappedFields = {
      senderName:
        customerDetail.name ||
        customerDetail.full_name ||
        customerDetail.customer_name ||
        customerDetail.sender_name ||
        "",
      senderCompanyName:
        customerDetail.company_name || customerDetail.name || "",
      senderZipCode:
        customerDetail.pincode ||
        customerDetail.zip_code ||
        customerDetail.postal_code ||
        "",
      // Use proper object format for state, city, and area
      senderState: customerDetail.state_name
        ? { value: customerDetail.state_id || customerDetail.id, label: customerDetail.state_name }
        : { value: "", label: "" },
      senderCity: customerDetail.city_name
        ? { value: customerDetail.city_id || customerDetail.id, label: customerDetail.city_name }
        : { value: "", label: "" },
      // Set area as { value, label } using proper area_id if available
      senderArea: customerDetail.area_name
        ? { value: customerDetail.area_id || customerDetail.id, label: customerDetail.area_name }
        : { value: "", label: "" },
      senderGstNo: customerDetail.gst_no || customerDetail.gst_number || "",
      senderAddressLine1:
        customerDetail.reg_address1 ||
        customerDetail.address1 ||
        customerDetail.address ||
        "",
      senderAddressLine2:
        customerDetail.reg_address2 || customerDetail.address2 || "",
      senderMobile:
        customerDetail.mobile ||
        customerDetail.mobile_no ||
        customerDetail.phone ||
        "",
      senderEmail: customerDetail.email || customerDetail.email_id || "",
    };

    return mappedFields;
  } catch (error) {
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
      senderName: customer.full_name || customer.sender_name || "",
      senderCompanyName: customer.company_name || "",
      senderZipCode: customer.pincode || "",
      // Use proper IDs for state, city, and area
      senderState: customer.state_name
        ? { value: customer.state_id || customer.id, label: customer.state_name }
        : { value: "", label: "" },
      senderCity: customer.city_name
        ? { value: customer.city_id || customer.id, label: customer.city_name }
        : { value: "", label: "" },
      // Set area as { value, label } using proper area_id
      senderArea: customer.area_name
        ? { value: customer.area_id || customer.id, label: customer.area_name }
        : { value: "", label: "" },
      senderGstNo: customer.gst_no || "",
      senderAddressLine1: customer.address1 || "",
      senderAddressLine2: customer.address2 || "",
      senderMobile: customer.mobile_no || "",
      senderEmail: customer.email || "",
    };
  } catch (error) {
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
      receiverName: customer.full_name || "",
      receiverCompanyName: customer.company_name || "",
      receiverZipCode: customer.pincode || "",
      // Use proper IDs for state, city, and area
      receiverState: customer.state_name
        ? { value: customer.state_id || customer.id, label: customer.state_name }
        : { value: "", label: "" },
      receiverCity: customer.city_name
        ? { value: customer.city_id || customer.id, label: customer.city_name }
        : { value: "", label: "" },
      // Set area as { value, label } using proper area_id
      receiverArea: customer.area_name
        ? { value: customer.area_id || customer.id, label: customer.area_name }
        : { value: "", label: "" },
      receiverGstNo: customer.gst_no || "",
      receiverAddressLine1: customer.address1 || "",
      receiverAddressLine2: customer.address2 || "",
      receiverMobile: customer.mobile_no || "",
      receiverEmail: customer.email || "",
    };
  } catch (error) {
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

  return customers.map((customer) => ({
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
      const userName =
        customerDetail.name ||
        customerDetail.full_name ||
        customerDetail.customer_name ||
        "Your Account";
      options.push({
        value: "login_user",
        label: `${userName} (Your Account)`,
      });
    }

    // Add other customers
    if (customers && Array.isArray(customers)) {
      const customerOptions = customers.map((customer) => ({
        value: customer.full_name,
        label: customer.full_name,
      }));
      options.push(...customerOptions);
    }
  } catch (error) {
    // Error handling can be added here if needed
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
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const userData = getUserData();

  // Extract parameters from user data or use defaults
  // Based on the codebase pattern, we'll use the user ID as m_id
  // and default values for branch_id since the exact source isn't clear
  return {
    branch_id: userData?.Customerdetail?.branch_id || "1", // Use from user data or default
    m_id: userData?.Customerdetail?.id || "1", // Use user ID as m_id
    next_id: "1", // Start from 1 for pagination
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
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const userData = getUserData();

  const params = {
    branch_id: userData?.Customerdetail?.branch_id || "1",
    m_id: userData?.Customerdetail?.id || "1",
    next_id: "1",
  };

  // Add search_query if provided
  if (searchQuery && searchQuery.trim() !== "") {
    return {
      ...params,
      search_query: searchQuery.trim(),
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
    senderName: "",
    senderCompanyName: "",
    senderZipCode: "",
    senderState: "",
    senderCity: "",
    senderArea: { value: "", label: "" },
    senderGstNo: "",
    senderAddressLine1: "",
    senderAddressLine2: "",
    senderMobile: "",
    senderEmail: "",
    senderCustomerId: "",
  };
};

/**
 * Clear all customer-related form fields for receiver
 * @returns Object with empty receiver field values
 */
export const clearReceiverFields = () => {
  return {
    receiverName: "",
    receiverCompanyName: "",
    receiverZipCode: "",
    receiverState: "",
    receiverCity: "",
    receiverArea: { value: "", label: "" },
    receiverGstNo: "",
    receiverAddressLine1: "",
    receiverAddressLine2: "",
    receiverMobile: "",
    receiverEmail: "",
    receiverCustomerId: "",
  };
};

/**
 * Convert areas array to dropdown options
 * @param areas Array of area objects from API
 * @returns Array of option objects for dropdown
 */
export const areasToOptions = (areas: any[]) => {
  return areas.map((area) => ({
    value: area.id,
    label: area.name,
  }));
};
