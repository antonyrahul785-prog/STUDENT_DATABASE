/**
 * Validation Utilities
 * Functions for validating various data types and formats
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(email);
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    messages: errors
  };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {string} countryCode - Country code (default: 'US')
 * @returns {Object} Validation result
 */
export const validatePhone = (phone, countryCode = 'US') => {
  // Basic phone validation - extend based on country requirements
  const regex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const isValid = regex.test(cleaned);
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid phone number'
  };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {Object} Validation result
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'This field') => {
  const isValid = !(value === null || value === undefined || value === '');
  
  return {
    isValid,
    message: isValid ? '' : `${fieldName} is required`
  };
};

/**
 * Validate numeric value
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, integerOnly = false } = options;
  const num = Number(value);
  const errors = [];
  
  if (isNaN(num)) {
    errors.push('Must be a valid number');
  } else {
    if (integerOnly && !Number.isInteger(num)) {
      errors.push('Must be an integer');
    }
    if (min !== undefined && num < min) {
      errors.push(`Must be at least ${min}`);
    }
    if (max !== undefined && num > max) {
      errors.push(`Must be at most ${max}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    messages: errors
  };
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, futureOnly = false, pastOnly = false } = options;
  const dateObj = new Date(date);
  const errors = [];
  
  if (isNaN(dateObj.getTime())) {
    errors.push('Must be a valid date');
  } else {
    const now = new Date();
    
    if (futureOnly && dateObj <= now) {
      errors.push('Date must be in the future');
    }
    if (pastOnly && dateObj >= now) {
      errors.push('Date must be in the past');
    }
    if (minDate && dateObj < new Date(minDate)) {
      errors.push(`Date must be after ${new Date(minDate).toLocaleDateString()}`);
    }
    if (maxDate && dateObj > new Date(maxDate)) {
      errors.push(`Date must be before ${new Date(maxDate).toLocaleDateString()}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    messages: errors
  };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const { maxSizeMB = 10, allowedTypes = [] } = options;
  const errors = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (!file) {
    errors.push('No file selected');
  } else {
    if (file.size > maxSizeBytes) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type must be: ${allowedTypes.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    messages: errors
  };
};

/**
 * Validate form with multiple fields
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Validation result
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    rules.forEach(rule => {
      const validation = rule(value);
      if (!validation.isValid) {
        if (!errors[field]) errors[field] = [];
        errors[field].push(...(validation.messages || [validation.message]));
        isValid = false;
      }
    });
  });
  
  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateURL,
  validateRequired,
  validateNumber,
  validateDate,
  validateFile,
  validateForm
};