import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    return await api.get('/courses', { params });
  },

  getCourseById: async (id) => {
    return await api.get(`/courses/${id}`);
  },

  createCourse: async (courseData) => {
    return await api.post('/courses', courseData);
  },

  updateCourse: async (id, courseData) => {
    return await api.put(`/courses/${id}`, courseData);
  },

  deleteCourse: async (id) => {
    return await api.delete(`/courses/${id}`);
  },

  getCourseBatches: async (courseId) => {
    return await api.get(`/courses/${courseId}/batches`);
  },

  createBatch: async (courseId, batchData) => {
    return await api.post(`/courses/${courseId}/batches`, batchData);
  }
};