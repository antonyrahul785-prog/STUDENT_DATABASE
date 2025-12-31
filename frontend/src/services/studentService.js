import api from './api';

export const studentService = {
  getStudents: async (params = {}) => {
    return await api.get('/students', { params });
  },

  getStudentById: async (id) => {
    return await api.get(`/students/${id}`);
  },

  createStudent: async (studentData) => {
    return await api.post('/students', studentData);
  },

  updateStudent: async (id, studentData) => {
    return await api.put(`/students/${id}`, studentData);
  },

  deleteStudent: async (id) => {
    return await api.delete(`/students/${id}`);
  },

  getStudentEnrollments: async (studentId) => {
    return await api.get(`/students/${studentId}/enrollments`);
  },

  getStudentPayments: async (studentId) => {
    return await api.get(`/students/${studentId}/payments`);
  },

  getStudentAttendance: async (studentId) => {
    return await api.get(`/students/${studentId}/attendance`);
  }
};