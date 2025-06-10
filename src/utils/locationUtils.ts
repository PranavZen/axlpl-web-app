/**
 * Location utilities for handling state, city, and area ID/name mappings
 */

// Common state/city mappings for Maharashtra (most common in the system)
export const COMMON_STATES = {
  'Maharashtra': '21',
  'Delhi': '7',
  'Karnataka': '14',
  'Tamil Nadu': '25',
  'Gujarat': '11',
  'Rajasthan': '20',
  'Uttar Pradesh': '28',
  'West Bengal': '30',
  'Madhya Pradesh': '16',
  'Haryana': '12'
};

export const COMMON_CITIES = {
  'Mumbai': '817',
  'Delhi': '216',
  'Bangalore': '124',
  'Chennai': '174',
  'Pune': '671',
  'Hyderabad': '364',
  'Ahmedabad': '18',
  'Kolkata': '447',
  'Surat': '746',
  'Jaipur': '386'
};

/**
 * Convert state name to state ID using common mappings
 * @param stateName The state name string
 * @returns State ID string or the original name if not found
 */
export const getStateIdFromName = (stateName: string): string => {
  if (!stateName || typeof stateName !== 'string') {
    return '';
  }
  
  const trimmedName = stateName.trim();
  return COMMON_STATES[trimmedName as keyof typeof COMMON_STATES] || trimmedName;
};

/**
 * Convert city name to city ID using common mappings
 * @param cityName The city name string
 * @returns City ID string or the original name if not found
 */
export const getCityIdFromName = (cityName: string): string => {
  if (!cityName || typeof cityName !== 'string') {
    return '';
  }
  
  const trimmedName = cityName.trim();
  return COMMON_CITIES[trimmedName as keyof typeof COMMON_CITIES] || trimmedName;
};

/**
 * Convert location field to proper ID, handling both objects and strings
 * @param field The field value (object with value/label or string)
 * @param fieldType The type of field ('state' or 'city')
 * @returns The ID string
 */
export const getLocationId = (field: any, fieldType: 'state' | 'city'): string => {
  if (field === null || field === undefined) {
    return '';
  }

  // If it's already an object with value property, extract the value (ID)
  if (typeof field === 'object' && field.value !== undefined) {
    return String(field.value);
  }

  // If it's a string, try to convert to ID using lookup tables
  if (typeof field === 'string' && field.trim() !== '') {
    const trimmedField = field.trim();
    
    if (fieldType === 'state') {
      return getStateIdFromName(trimmedField);
    } else if (fieldType === 'city') {
      return getCityIdFromName(trimmedField);
    }
    
    return trimmedField;
  }

  // If it's a number, return as string
  if (typeof field === 'number') {
    return String(field);
  }

  return '';
};

/**
 * Create a proper select option object from state/city name
 * @param name The state or city name
 * @param fieldType The type of field ('state' or 'city')
 * @returns Object with value (ID) and label (name)
 */
export const createLocationOption = (name: string, fieldType: 'state' | 'city'): { value: string; label: string } | null => {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const trimmedName = name.trim();
  const id = fieldType === 'state' ? getStateIdFromName(trimmedName) : getCityIdFromName(trimmedName);
  
  return {
    value: id,
    label: trimmedName
  };
};

/**
 * Enhanced location field ID extractor with better logging and lookup support
 * @param field The field value
 * @param fieldName The field name for logging
 * @param fieldType The type of field ('state', 'city', or 'area')
 * @param defaultValue Default value if field is empty
 * @returns The ID string
 */
export const extractLocationId = (
  field: any, 
  fieldName: string, 
  fieldType: 'state' | 'city' | 'area', 
  defaultValue: string = ""
): string => {
  if (field === null || field === undefined) {
    console.log(`📍 ${fieldName} is null/undefined, using default: "${defaultValue}"`);
    return defaultValue;
  }

  // If it's a select object with value property, extract the value (ID)
  if (typeof field === 'object' && field.value !== undefined) {
    console.log(`📍 ${fieldName} object found, extracting ID: "${field.value}" (label: "${field.label}")`);
    return String(field.value);
  }

  // If it's a string, try to convert to ID using lookup tables (for state/city only)
  if (typeof field === 'string' && field.trim() !== '') {
    const trimmedField = field.trim();
    
    if (fieldType === 'state' || fieldType === 'city') {
      const id = getLocationId(field, fieldType);
      if (id !== trimmedField) {
        console.log(`📍 ${fieldName} string "${trimmedField}" converted to ID: "${id}"`);
        return id;
      } else {
        console.log(`📍 ${fieldName} string "${trimmedField}" - no ID mapping found, using as-is`);
        return trimmedField;
      }
    } else {
      console.log(`📍 ${fieldName} string found: "${trimmedField}" (area field, using as-is)`);
      return trimmedField;
    }
  }

  // If it's a number, return as string
  if (typeof field === 'number') {
    console.log(`📍 ${fieldName} number found: "${field}"`);
    return String(field);
  }

  // Fallback to default value
  console.log(`📍 ${fieldName} fallback to default: "${defaultValue}"`);
  return defaultValue;
};
