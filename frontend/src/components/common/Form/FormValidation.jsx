import React, { createContext, useContext } from 'react';

const FormValidationContext = createContext();

export const useFormValidation = () => {
  const context = useContext(FormValidationContext);
  if (!context) {
    throw new Error('useFormValidation must be used within FormValidationProvider');
  }
  return context;
};

export const FormValidationProvider = ({ children, schema }) => {
  const validateField = (name, value) => {
    if (!schema || !schema[name]) return null;
    
    const rules = schema[name];
    for (const rule of rules) {
      const error = rule.validator(value);
      if (error) return error;
    }
    
    return null;
  };

  const validateForm = (formData) => {
    const errors = {};
    
    for (const fieldName in schema) {
      const value = formData[fieldName];
      const error = validateField(fieldName, value);
      if (error) {
        errors[fieldName] = error;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validationRules = {
    required: (message = 'This field is required') => ({
      validator: (value) => {
        if (value === null || value === undefined || value === '') {
          return message;
        }
        if (Array.isArray(value) && value.length === 0) {
          return message;
        }
        return null;
      },
    }),
    
    email: (message = 'Invalid email address') => ({
      validator: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : message;
      },
    }),
    
    minLength: (min, message = `Must be at least ${min} characters`) => ({
      validator: (value) => {
        if (!value) return null;
        return value.length >= min ? null : message;
      },
    }),
    
    maxLength: (max, message = `Must be at most ${max} characters`) => ({
      validator: (value) => {
        if (!value) return null;
        return value.length <= max ? null : message;
      },
    }),
    
    pattern: (regex, message = 'Invalid format') => ({
      validator: (value) => {
        if (!value) return null;
        return regex.test(value) ? null : message;
      },
    }),
    
    min: (min, message = `Must be at least ${min}`) => ({
      validator: (value) => {
        if (value === null || value === undefined || value === '') return null;
        const num = parseFloat(value);
        return !isNaN(num) && num >= min ? null : message;
      },
    }),
    
    max: (max, message = `Must be at most ${max}`) => ({
      validator: (value) => {
        if (value === null || value === undefined || value === '') return null;
        const num = parseFloat(value);
        return !isNaN(num) && num <= max ? null : message;
      },
    }),
    
    phone: (message = 'Invalid phone number') => ({
      validator: (value) => {
        if (!value) return null;
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(value.replace(/\s/g, '')) ? null : message;
      },
    }),
  };

  return (
    <FormValidationContext.Provider value={{ validateField, validateForm, validationRules }}>
      {children}
    </FormValidationContext.Provider>
  );
};

export const useValidation = () => {
  const { validationRules } = useFormValidation();
  return validationRules;
};