import api, { apiMethods, handleApiError } from './api';

const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiMethods.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await apiMethods.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiMethods.post('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await apiMethods.post('/auth/forgot-password', { email });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiMethods.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Verify Email
  verifyEmail: async (token) => {
    try {
      const response = await apiMethods.post('/auth/verify-email', { token });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Resend Verification Email
  resendVerification: async (email) => {
    try {
      const response = await apiMethods.post('/auth/resend-verification', { email });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    try {
      const response = await apiMethods.post('/auth/refresh-token', { refreshToken });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await apiMethods.get('/auth/me');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Update Profile
  updateProfile: async (userData) => {
    try {
      const response = await apiMethods.put('/auth/profile', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiMethods.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Upload Profile Picture
  uploadProfilePicture: async (formData) => {
    try {
      const response = await apiMethods.upload('/auth/upload-profile', formData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Delete Account
  deleteAccount: async (password) => {
    try {
      const response = await apiMethods.post('/auth/delete-account', { password });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },

  // Check Auth Status
  checkAuth: async () => {
    try {
      const response = await apiMethods.get('/auth/check');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: handleApiError(error),
      };
    }
  },
};

export default authService;