import api from './api';
import { handleApiError } from './errorHandler';

const userService = {
  // Get all users with pagination and filters
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params });
      return {
        success: true,
        data: response.data.users || response.data,
        pagination: response.data.pagination || {},
        total: response.data.total || response.data.users?.length || 0
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create user (admin only)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return {
        success: true,
        data: response.data,
        message: 'User created successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data,
        message: 'User updated successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role });
      return {
        success: true,
        data: response.data,
        message: `User role updated to ${role}`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { status });
      return {
        success: true,
        data: response.data,
        message: `User status updated to ${status}`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Change user password (admin)
  changeUserPassword: async (userId, newPassword) => {
    try {
      const response = await api.patch(`/users/${userId}/password`, { newPassword });
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Search users
  searchUsers: async (query, params = {}) => {
    try {
      const response = await api.get('/users/search', {
        params: { q: query, ...params }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get users by role
  getUsersByRole: async (role, params = {}) => {
    try {
      const response = await api.get(`/users/role/${role}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Bulk update users
  bulkUpdateUsers: async (userIds, updateData) => {
    try {
      const response = await api.post('/users/bulk-update', {
        userIds,
        ...updateData
      });
      return {
        success: true,
        data: response.data,
        message: `Updated ${response.data.updated || 0} users`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Bulk delete users
  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await api.post('/users/bulk-delete', { userIds });
      return {
        success: true,
        data: response.data,
        message: `Deleted ${response.data.deleted || 0} users`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Export users
  exportUsers: async (format = 'excel', params = {}) => {
    try {
      const response = await api.get('/users/export', {
        params: { format, ...params },
        responseType: 'blob'
      });
      
      return {
        success: true,
        data: response.data,
        filename: `users-export.${format === 'excel' ? 'xlsx' : 'csv'}`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Import users from file
  importUsers: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options.sendWelcomeEmail) {
        formData.append('sendWelcomeEmail', 'true');
      }
      
      const response = await api.post('/users/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: `Imported ${response.data.imported || 0} users`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user activity logs
  getUserActivity: async (userId, params = {}) => {
    try {
      const response = await api.get(`/users/${userId}/activity`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send notification to user
  sendUserNotification: async (userId, notification) => {
    try {
      const response = await api.post(`/users/${userId}/notify`, notification);
      return {
        success: true,
        data: response.data,
        message: 'Notification sent successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Bulk send notifications
  bulkSendNotifications: async (userIds, notification) => {
    try {
      const response = await api.post('/users/bulk-notify', {
        userIds,
        notification
      });
      return {
        success: true,
        data: response.data,
        message: `Notification sent to ${response.data.sent || 0} users`
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Upload user profile picture
  uploadProfilePicture: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Profile picture uploaded successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete user profile picture
  deleteProfilePicture: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}/avatar`);
      return {
        success: true,
        data: response.data,
        message: 'Profile picture removed'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user permissions
  getUserPermissions: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user permissions
  updateUserPermissions: async (userId, permissions) => {
    try {
      const response = await api.put(`/users/${userId}/permissions`, { permissions });
      return {
        success: true,
        data: response.data,
        message: 'Permissions updated successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user dashboard data
  getUserDashboard: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/dashboard`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Verify user email (admin)
  verifyUserEmail: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/verify-email`);
      return {
        success: true,
        data: response.data,
        message: 'Email verified successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Send password reset link to user
  sendPasswordReset: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/send-password-reset`);
      return {
        success: true,
        data: response.data,
        message: 'Password reset link sent successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user sessions
  getUserSessions: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/sessions`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Terminate user session
  terminateUserSession: async (userId, sessionId) => {
    try {
      const response = await api.delete(`/users/${userId}/sessions/${sessionId}`);
      return {
        success: true,
        data: response.data,
        message: 'Session terminated successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/preferences`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update user preferences
  updateUserPreferences: async (userId, preferences) => {
    try {
      const response = await api.put(`/users/${userId}/preferences`, preferences);
      return {
        success: true,
        data: response.data,
        message: 'Preferences updated successfully'
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default userService;