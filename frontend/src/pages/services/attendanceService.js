import api from './api';

export const attendanceService = {
  getAttendance: async (params = {}) => {
    return await api.get('/attendance', { params });
  },

  getAttendanceById: async (id) => {
    return await api.get(`/attendance/${id}`);
  },

  markAttendance: async (attendanceData) => {
    return await api.post('/attendance', attendanceData);
  },

  updateAttendance: async (id, attendanceData) => {
    return await api.put(`/attendance/${id}`, attendanceData);
  },

  deleteAttendance: async (id) => {
    return await api.delete(`/attendance/${id}`);
  },

  getAttendanceStats: async (params = {}) => {
    return await api.get('/attendance/stats', { params });
  }
};