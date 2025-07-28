import { validateMobileOrEmail, detectInputType } from '../utils/validationUtils';

describe('Login Input Validation', () => {
  describe('detectInputType', () => {
    test('should detect mobile numbers correctly', () => {
      expect(detectInputType('9876543210')).toBe('mobile');
      expect(detectInputType('8765432109')).toBe('mobile');
      expect(detectInputType('7654321098')).toBe('mobile');
      expect(detectInputType('6543210987')).toBe('mobile');
    });

    test('should detect email addresses correctly', () => {
      expect(detectInputType('user@example.com')).toBe('email');
      expect(detectInputType('john.doe@company.co.in')).toBe('email');
      expect(detectInputType('admin@axlpl.com')).toBe('email');
    });

    test('should detect unknown inputs correctly', () => {
      expect(detectInputType('12345')).toBe('unknown');
      expect(detectInputType('5876543210')).toBe('unknown'); // starts with 5
      expect(detectInputType('abcdef')).toBe('unknown');
      expect(detectInputType('user@')).toBe('unknown'); // incomplete email
    });
  });

  describe('validateMobileOrEmail', () => {
    test('should validate mobile numbers correctly', () => {
      // Valid mobile numbers
      expect(validateMobileOrEmail('9876543210')).toEqual({ isValid: true });
      expect(validateMobileOrEmail('8765432109')).toEqual({ isValid: true });
      expect(validateMobileOrEmail('7654321098')).toEqual({ isValid: true });
      expect(validateMobileOrEmail('6543210987')).toEqual({ isValid: true });

      // Invalid mobile numbers
      expect(validateMobileOrEmail('5876543210')).toEqual({
        isValid: false,
        error: 'Mobile number must start with 6, 7, 8, or 9'
      });
      expect(validateMobileOrEmail('123456789')).toEqual({
        isValid: false,
        error: 'Mobile number must be 10 digits'
      });
      expect(validateMobileOrEmail('12345678901')).toEqual({
        isValid: false,
        error: 'Mobile number must be exactly 10 digits'
      });
    });

    test('should validate email addresses correctly', () => {
      // Valid emails
      expect(validateMobileOrEmail('user@example.com')).toEqual({ isValid: true });
      expect(validateMobileOrEmail('john.doe@company.co.in')).toEqual({ isValid: true });

      // Invalid emails
      expect(validateMobileOrEmail('user@')).toEqual({
        isValid: false,
        error: 'Please enter a valid email address'
      });
      expect(validateMobileOrEmail('@example.com')).toEqual({
        isValid: false,
        error: 'Please enter a valid email address'
      });
    });

    test('should handle empty inputs', () => {
      expect(validateMobileOrEmail('')).toEqual({
        isValid: false,
        error: 'Mobile number or email is required'
      });
      expect(validateMobileOrEmail('   ')).toEqual({
        isValid: false,
        error: 'Mobile number or email is required'
      });
    });

    test('should handle unknown format inputs', () => {
      expect(validateMobileOrEmail('abcdef')).toEqual({
        isValid: false,
        error: 'Please enter a valid mobile number (10 digits) or email address'
      });
    });
  });
});

// Test data for manual testing
export const testCases = {
  validMobileNumbers: [
    '9876543210',
    '8765432109', 
    '7654321098',
    '6543210987'
  ],
  validEmails: [
    'user@example.com',
    'john.doe@company.co.in',
    'admin@axlpl.com',
    'test.user@domain.org'
  ],
  invalidMobileNumbers: [
    '12345',      // too short
    '5876543210', // starts with 5
    '123456789',  // 9 digits
    '12345678901' // 11 digits
  ],
  invalidEmails: [
    'user@',
    '@example.com',
    'plainaddress',
    'user.example.com'
  ]
};
