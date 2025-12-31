import api, { apiMethods, handleApiError } from './api';

const leadService = {
  // Get all leads with filters
  getLeads: async (params = {}) => {
    try {
      const response = await apiMethods.get('/leads', { params });
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

  // Get lead by ID
  getLeadById: async (leadId) => {
    try {
      const response = await apiMethods.get(`/leads/${leadId}`);
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

  // Create new lead
  createLead: async (leadData) => {
    try {
      const response = await apiMethods.post('/leads', leadData);
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

  // Update lead
  updateLead: async (leadId, leadData) => {
    try {
      const response = await apiMethods.put(`/leads/${leadId}`, leadData);
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

  // Delete lead
  deleteLead: async (leadId) => {
    try {
      const response = await apiMethods.delete(`/leads/${leadId}`);
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

  // Update lead status
  updateLeadStatus: async (leadId, status, notes = '') => {
    try {
      const response = await apiMethods.patch(`/leads/${leadId}/status`, {
        status,
        notes,
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

  // Assign lead to user
  assignLead: async (leadId, userId) => {
    try {
      const response = await apiMethods.patch(`/leads/${leadId}/assign`, { userId });
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

  // Convert lead to student
  convertLeadToStudent: async (leadId, studentData = {}) => {
    try {
      const response = await apiMethods.post(`/leads/${leadId}/convert`, studentData);
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

  // Get lead statistics
  getLeadStats: async (params = {}) => {
    try {
      const response = await apiMethods.get('/leads/stats', { params });
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

  // Import leads from CSV
  importLeads: async (formData) => {
    try {
      const response = await apiMethods.upload('/leads/import', formData);
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

  // Export leads
  exportLeads: async (format = 'csv', filters = {}) => {
    try {
      const response = await apiMethods.get('/leads/export', {
        params: { format, ...filters },
        responseType: 'blob',
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

  // Get lead sources
  getLeadSources: async () => {
    try {
      const response = await apiMethods.get('/leads/sources');
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

  // Add lead note
  addLeadNote: async (leadId, note) => {
    try {
      const response = await apiMethods.post(`/leads/${leadId}/notes`, { note });
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

  // Get lead notes
  getLeadNotes: async (leadId) => {
    try {
      const response = await apiMethods.get(`/leads/${leadId}/notes`);
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

  // Schedule lead follow-up
  scheduleFollowUp: async (leadId, followUpData) => {
    try {
      const response = await apiMethods.post(`/leads/${leadId}/follow-up`, followUpData);
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

  // Get lead follow-ups
  getLeadFollowUps: async (leadId) => {
    try {
      const response = await apiMethods.get(`/leads/${leadId}/follow-ups`);
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

export default leadService;