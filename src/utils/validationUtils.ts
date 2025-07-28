/**
 * Validation utility functions for form fields
 */

import { AddressFormData } from "../components/pagecomponents/addressespage/forms/AddressForm";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Detect if input is mobile number or email
 */
export const detectInputType = (value: string): 'mobile' | 'email' | 'unknown' => {
  const trimmedValue = value?.trim() || '';
  
  // Check if it's a mobile number (10 digits, starting with 6-9)
  if (/^[6-9]\d{9}$/.test(trimmedValue)) {
    return 'mobile';
  }
  
  // Check if it contains @ symbol and has basic email structure
  if (trimmedValue.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'email';
  }
  
  return 'unknown';
};

/**
 * Validate mobile number or email for login
 */
export const validateMobileOrEmail = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Please enter your mobile number or email address' };
  }
  
  const inputType = detectInputType(trimmedValue);
  
  if (inputType === 'mobile') {
    // Validate mobile number - must be 10 digits starting with 6-9
    if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
      return { isValid: false, error: 'Mobile number must be 10 digits starting with 6, 7, 8, or 9' };
    }
    return { isValid: true };
  } else if (inputType === 'email') {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true };
  } else {
    // If input doesn't match either format, provide specific guidance
    if (/^\d+$/.test(trimmedValue)) {
      if (trimmedValue.length < 10) {
        return { isValid: false, error: `Mobile number must be 10 digits (you entered ${trimmedValue.length})` };
      } else if (trimmedValue.length > 10) {
        return { isValid: false, error: 'Mobile number must be exactly 10 digits' };
      } else if (!/^[6-9]/.test(trimmedValue)) {
        return { isValid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
      }
    } else if (trimmedValue.includes('@')) {
      return { isValid: false, error: 'Please enter a valid email address (e.g., user@example.com)' };
    }
    
    return { isValid: false, error: 'Please enter a valid mobile number (10 digits) or email address' };
  }
};

/**
 * Validate name fields (sender/receiver names)
 */
export const validateName = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmedValue.length > 100) {
    return { isValid: false, error: 'Name cannot exceed 100 characters' };
  }
  
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmedValue)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, dots, apostrophes, and hyphens' };
  }
  
  return { isValid: true };
};

/**
 * Validate company name fields
 */
export const validateCompanyName = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Company name is required' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'Company name must be at least 2 characters' };
  }
  
  if (trimmedValue.length > 200) {
    return { isValid: false, error: 'Company name cannot exceed 200 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate zip code/pincode fields
 */
export const validateZipCode = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Zip code is required' };
  }
  
  if (!/^\d{6}$/.test(trimmedValue)) {
    return { isValid: false, error: 'Zip code must be exactly 6 digits' };
  }
  
  return { isValid: true };
};

/**
 * Validate state fields
 */
// export const validateState = (value: string): ValidationResult => {
//   const trimmedValue = value?.trim() || '';
  
//   if (!trimmedValue) {
//     return { isValid: false, error: 'State is required' };
//   }
  
//   if (trimmedValue.length < 2) {
//     return { isValid: false, error: 'State must be at least 2 characters' };
//   }
  
//   if (trimmedValue.length > 50) {
//     return { isValid: false, error: 'State cannot exceed 50 characters' };
//   }
  
//   if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
//     return { isValid: false, error: 'State can only contain letters, spaces, dots, and hyphens' };
//   }
  
//   return { isValid: true };
// };

export const validateState = (value: { value: string; label: string } | string): ValidationResult => {
  const rawValue = typeof value === "object" && value !== null ? value.value : value;
  const trimmedValue = rawValue?.trim() || '';

  if (!trimmedValue) {
    return { isValid: false, error: 'State is required' };
  }

  // if (trimmedValue.length < 2) {
  //   return { isValid: false, error: 'State must be at least 2 characters' };
  // }

  // if (trimmedValue.length > 50) {
  //   return { isValid: false, error: 'State cannot exceed 50 characters' };
  // }

  // if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
  //   return { isValid: false, error: 'State can only contain letters, spaces, dots, and hyphens' };
  // }

  return { isValid: true };
};

/**
 * Validate city fields
 */
// export const validateCity = (value: string): ValidationResult => {
//   const trimmedValue = value?.trim() || '';
  
//   if (!trimmedValue) {
//     return { isValid: false, error: 'City is required' };
//   }
  
//   if (trimmedValue.length < 2) {
//     return { isValid: false, error: 'City must be at least 2 characters' };
//   }
  
//   if (trimmedValue.length > 100) {
//     return { isValid: false, error: 'City cannot exceed 100 characters' };
//   }
  
//   if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
//     return { isValid: false, error: 'City can only contain letters, spaces, dots, and hyphens' };
//   }
  
//   return { isValid: true };
// };

export const validateCity = (value: { value: string; label: string } | string): ValidationResult => {
  const rawValue = typeof value === "object" && value !== null ? value.value : value;
  const trimmedValue = rawValue?.trim() || '';

  if (!trimmedValue) {
    return { isValid: false, error: 'City is required' };
  }

  // if (trimmedValue.length < 2) {
  //   return { isValid: false, error: 'City must be at least 2 characters' };
  // }

  // if (trimmedValue.length > 100) {
  //   return { isValid: false, error: 'City cannot exceed 100 characters' };
  // }

  // if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
  //   return { isValid: false, error: 'City can only contain letters, spaces, dots, and hyphens' };
  // }

  return { isValid: true };
};

/**
 * Validate GST number (optional field)
 */
export const validateGstNumber = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  // GST is optional, so empty value is valid
  if (!trimmedValue) {
    return { isValid: true };
  }
  
  if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(trimmedValue)) {
    return { isValid: false, error: 'Invalid GST number format' };
  }
  
  return { isValid: true };
};

/**
 * Validate address line fields
 */
export const validateAddressLine1 = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Address line 1 is required' };
  }
  
  if (trimmedValue.length < 5) {
    return { isValid: false, error: 'Address must be at least 5 characters' };
  }
  
  if (trimmedValue.length > 200) {
    return { isValid: false, error: 'Address cannot exceed 200 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate address line 2 (optional)
 */
export const validateAddressLine2 = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  // Address line 2 is optional
  if (!trimmedValue) {
    return { isValid: true };
  }
  
  if (trimmedValue.length > 200) {
    return { isValid: false, error: 'Address cannot exceed 200 characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate mobile number fields
 */
export const validateMobile = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Mobile number is required' };
  }
  
  if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
    return { isValid: false, error: 'Mobile number must be 10 digits starting with 6, 7, 8, or 9' };
  }
  
  return { isValid: true };
};

/**
 * Validate email fields
 */
export const validateEmail = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (trimmedValue.length > 100) {
    return { isValid: false, error: 'Email cannot exceed 100 characters' };
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedValue)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  return { isValid: true };
};

/**
 * Validate all address form fields
 */
export const validateAddressForm = (formData: AddressFormData) => {
  const errors: { [key: string]: string } = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  if (!formData.company_name.trim()) {
    errors.company_name = "Company Name is required";
  }

  if (!formData.zip_code || formData.zip_code.length !== 6) {
    errors.zip_code = "Zip Code must be 6 digits";
  }

  if (!formData.state_id?.value) {
    errors.state_id = "State is required";
  }

  if (!formData.city_id?.value) {
    errors.city_id = "City is required";
  }

  if (!formData.area_id?.value) {
    errors.area_id = "Area is required";
  }

  if (!formData.address1.trim()) {
    errors.address1 = "Address Line 1 is required";
  }

  if (!formData.mobile_no.trim()) {
    errors.mobile_no = "Mobile number is required";
  } else if (!/^[6-9]\d{9}$/.test(formData.mobile_no)) {
    errors.mobile_no = "Invalid mobile number";
  }

  if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};
