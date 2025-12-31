import api from './api';

export const enrollmentService = {
  getEnrollments: async (params = {}) => {
    return await api.get('/enrollments', { params });
  },

  getEnrollmentById: async (id) => {
    return await api.get(`/enrollments/${id}`);
  },

  createEnrollment: async (enrollmentData) => {
    return await api.post('/enrollments', enrollmentData);
  },

  updateEnrollment: async (id, enrollmentData) => {
    return await api.put(`/enrollments/${id}`, enrollmentData);
  },

  deleteEnrollment: async (id) => {
    return await api.delete(`/enrollments/${id}`);
  },

  updateEnrollmentStatus: async (id, status) => {
    return await api.patch(`/enrollments/${id}/status`, { status });
  }
};