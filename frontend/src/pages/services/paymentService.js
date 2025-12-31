import api from './api';

export const paymentService = {
  // Get all payments
  getPayments: async (params = {}) => {
    return await api.get('/payments', { params });
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    return await api.get(`/payments/${id}`);
  },

  // Create new payment
  createPayment: async (paymentData) => {
    return await api.post('/payments', paymentData);
  },

  // Update payment
  updatePayment: async (id, paymentData) => {
    return await api.put(`/payments/${id}`, paymentData);
  },

  // Delete payment
  deletePayment: async (id) => {
    return await api.delete(`/payments/${id}`);
  },

  // Get fee summary for student
  getFeeSummary: async (studentId) => {
    return await api.get(`/students/${studentId}/fee-summary`);
  },

  // Generate receipt
  generateReceipt: async (paymentId) => {
    return await api.get(`/payments/${paymentId}/receipt`);
  },

  // Get payment statistics
  getPaymentStats: async () => {
    return await api.get('/payments/stats');
  }
};