/**
 * Data Formatting Utilities
 * Functions for formatting data for display and API consumption
 */

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date|number} date - Date to format
 * @param {string} format - Format string or preset
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'standard', locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const formats = {
    short: { dateStyle: 'short' },
    medium: { dateStyle: 'medium' },
    long: { dateStyle: 'long' },
    full: { dateStyle: 'full' },
    standard: { year: 'numeric', month: 'short', day: 'numeric' },
    monthYear: { year: 'numeric', month: 'long' },
    time: { timeStyle: 'short' },
    datetime: { dateStyle: 'medium', timeStyle: 'short' }
  };
  
  const options = typeof format === 'string' 
    ? formats[format] || formats.standard 
    : format;
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format date relative to now (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  
  return formatDate(date, 'standard');
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number as percentage
 * @param {number} value - Number to format (0-1 or 0-100)
 * @param {boolean} isDecimal - If true, value is 0-1; if false, 0-100
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, isDecimal = true) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number
 * @param {string} countryCode - Country code for formatting
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone, countryCode = 'US') => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // US formatting: (123) 456-7890
  if (countryCode === 'US' && cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  // International formatting: +1 234 567 8900
  if (cleaned.length > 10) {
    return `+${cleaned.substring(0, cleaned.length - 10)} ${cleaned.substring(cleaned.length - 10, cleaned.length - 7)} ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)} ${cleaned.substring(cleaned.length - 4)}`;
  }
  
  return phone;
};

/**
 * Format social security number (SSN)
 * @param {string} ssn - Raw SSN
 * @returns {string} Formatted SSN
 */
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 5)}-${cleaned.substring(5)}`;
  }
  return ssn;
};

/**
 * Format credit card number for display
 * @param {string} cardNumber - Raw card number
 * @returns {string} Formatted card number
 */
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  const parts = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    parts.push(cleaned.substring(i, i + 4));
  }
  
  return parts.join(' ');
};

/**
 * Mask sensitive information
 * @param {string} text - Text to mask
 * @param {string} type - Type of masking
 * @returns {string} Masked text
 */
export const maskSensitive = (text, type = 'email') => {
  if (!text) return '';
  
  switch (type) {
    case 'email':
      const [username, domain] = text.split('@');
      if (!domain) return text;
      return `${username.substring(0, 2)}***@${domain}`;
      
    case 'phone':
      return text.replace(/\d(?=\d{4})/g, '*');
      
    case 'creditCard':
      return `**** ${text.slice(-4)}`;
      
    case 'ssn':
      return `***-**-${text.slice(-4)}`;
      
    default:
      return text;
  }
};

/**
 * Format array as comma-separated string
 * @param {Array} array - Array to format
 * @param {number} limit - Maximum items to show
 * @returns {string} Formatted string
 */
export const formatArrayToString = (array, limit = 5) => {
  if (!array || !Array.isArray(array)) return '';
  
  if (array.length <= limit) {
    return array.join(', ');
  }
  
  return `${array.slice(0, limit).join(', ')} and ${array.length - limit} more`;
};

/**
 * Convert camelCase to Title Case
 * @param {string} str - CamelCase string
 * @returns {string} Title Case string
 */
export const camelToTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, char => char.toUpperCase())
    .trim();
};

export default {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPercentage,
  truncateText,
  formatPhoneNumber,
  formatSSN,
  formatCreditCard,
  maskSensitive,
  formatArrayToString,
  camelToTitleCase
};