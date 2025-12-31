import api from './api';

export const leadService = {
  getLeads: async (params = {}) => {
    return await api.get('/leads', { params });
  },

  getLeadById: async (id) => {
    return await api.get(`/leads/${id}`);
  },

  createLead: async (leadData) => {
    return await api.post('/leads', leadData);
  },

  updateLead: async (id, leadData) => {
    return await api.put(`/leads/${id}`, leadData);
  },

  deleteLead: async (id) => {
    return await api.delete(`/leads/${id}`);
  },

  updateLeadStatus: async (id, status) => {
    return await api.patch(`/leads/${id}/status`, { status });
  },

  addCommunication: async (id, communication) => {
    return await api.post(`/leads/${id}/communications`, communication);
  },

  getLeadStats: async () => {
    return await api.get('/leads/stats');
  }
};