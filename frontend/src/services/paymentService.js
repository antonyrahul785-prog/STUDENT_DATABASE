import api from './api';

export const paymentService = {
  getPayments: async (params) => {
    return await api.get('/payments', { params });
  },

  getPaymentById: async (id) => {
    return await api.get(`/payments/${id}`);
  },

  createPayment: async (paymentData) => {
    return await api.post('/payments', paymentData);
  },

  updatePayment: async (id, paymentData) => {
    return await api.put(`/payments/${id}`, paymentData);
  },

  deletePayment: async (id) => {
    return await api.delete(`/payments/${id}`);
  },

  getFeeSummary: async (studentId) => {
    return await api.get(`/payments/summary/${studentId}`);
  },

  generateReceipt: async (paymentId) => {
    return await api.get(`/payments/receipt/${paymentId}`);
  }
};