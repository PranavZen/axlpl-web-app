/**
 * Validation utility functions for form fields
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

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
export const validateState = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'State is required' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'State must be at least 2 characters' };
  }
  
  if (trimmedValue.length > 50) {
    return { isValid: false, error: 'State cannot exceed 50 characters' };
  }
  
  if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
    return { isValid: false, error: 'State can only contain letters, spaces, dots, and hyphens' };
  }
  
  return { isValid: true };
};

/**
 * Validate city fields
 */
export const validateCity = (value: string): ValidationResult => {
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue) {
    return { isValid: false, error: 'City is required' };
  }
  
  if (trimmedValue.length < 2) {
    return { isValid: false, error: 'City must be at least 2 characters' };
  }
  
  if (trimmedValue.length > 100) {
    return { isValid: false, error: 'City cannot exceed 100 characters' };
  }
  
  if (!/^[a-zA-Z\s.-]+$/.test(trimmedValue)) {
    return { isValid: false, error: 'City can only contain letters, spaces, dots, and hyphens' };
  }
  
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
export const validateAddressForm = (formData: any): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  // Validate company name
  const companyValidation = validateCompanyName(formData.company_name);
  if (!companyValidation.isValid) {
    errors.company_name = companyValidation.error!;
  }
  
  // Validate zip code
  const zipValidation = validateZipCode(formData.zip_code);
  if (!zipValidation.isValid) {
    errors.zip_code = zipValidation.error!;
  }
  
  // Validate state
  const stateValidation = validateState(formData.state_id);
  if (!stateValidation.isValid) {
    errors.state_id = stateValidation.error!;
  }
  
  // Validate address line 1
  const address1Validation = validateAddressLine1(formData.address1);
  if (!address1Validation.isValid) {
    errors.address1 = address1Validation.error!;
  }
  
  // Validate address line 2 (optional)
  const address2Validation = validateAddressLine2(formData.address2);
  if (!address2Validation.isValid) {
    errors.address2 = address2Validation.error!;
  }
  
  // Validate mobile
  const mobileValidation = validateMobile(formData.mobile_no);
  if (!mobileValidation.isValid) {
    errors.mobile_no = mobileValidation.error!;
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  // Validate GST number (optional)
  const gstValidation = validateGstNumber(formData.sender_gst_no);
  if (!gstValidation.isValid) {
    errors.sender_gst_no = gstValidation.error!;
  }
  
  return errors;
};
