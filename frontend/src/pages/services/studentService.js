import api, { apiMethods, handleApiError } from './api';

const studentService = {
  // Get all students
  getStudents: async (params = {}) => {
    try {
      const response = await apiMethods.get('/students', { params });
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

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      const response = await apiMethods.get(`/students/${studentId}`);
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

  // Create student
  createStudent: async (studentData) => {
    try {
      const response = await apiMethods.post('/students', studentData);
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

  // Update student
  updateStudent: async (studentId, studentData) => {
    try {
      const response = await apiMethods.put(`/students/${studentId}`, studentData);
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

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const response = await apiMethods.delete(`/students/${studentId}`);
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

  // Update student status
  updateStudentStatus: async (studentId, status) => {
    try {
      const response = await apiMethods.patch(`/students/${studentId}/status`, { status });
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

  // Get student statistics
  getStudentStats: async () => {
    try {
      const response = await apiMethods.get('/students/stats');
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

  // Search students
  searchStudents: async (query, filters = {}) => {
    try {
      const response = await apiMethods.get('/students/search', {
        params: { query, ...filters },
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

  // Get student enrollments
  getStudentEnrollments: async (studentId) => {
    try {
      const response = await apiMethods.get(`/students/${studentId}/enrollments`);
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

  // Get student payments
  getStudentPayments: async (studentId, params = {}) => {
    try {
      const response = await apiMethods.get(`/students/${studentId}/payments`, { params });
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

  // Get student attendance
  getStudentAttendance: async (studentId, params = {}) => {
    try {
      const response = await apiMethods.get(`/students/${studentId}/attendance`, { params });
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

  // Add student document
  addStudentDocument: async (studentId, formData) => {
    try {
      const response = await apiMethods.upload(`/students/${studentId}/documents`, formData);
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

  // Get student documents
  getStudentDocuments: async (studentId) => {
    try {
      const response = await apiMethods.get(`/students/${studentId}/documents`);
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

  // Delete student document
  deleteStudentDocument: async (studentId, documentId) => {
    try {
      const response = await apiMethods.delete(`/students/${studentId}/documents/${documentId}`);
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

  // Send student notification
  sendStudentNotification: async (studentId, notification) => {
    try {
      const response = await apiMethods.post(`/students/${studentId}/notify`, notification);
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

  // Bulk update students
  bulkUpdateStudents: async (studentIds, updateData) => {
    try {
      const response = await apiMethods.post('/students/bulk-update', {
        studentIds,
        updateData,
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

  // Export students
  exportStudents: async (format = 'csv', filters = {}) => {
    try {
      const response = await apiMethods.get('/students/export', {
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
};

export default studentService;