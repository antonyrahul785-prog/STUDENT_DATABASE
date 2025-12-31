import api from './api';

export const contentService = {
  getContent: async (params = {}) => {
    return await api.get('/content', { params });
  },

  getContentById: async (id) => {
    return await api.get(`/content/${id}`);
  },

  createContent: async (contentData) => {
    return await api.post('/content', contentData);
  },

  updateContent: async (id, contentData) => {
    return await api.put(`/content/${id}`, contentData);
  },

  deleteContent: async (id) => {
    return await api.delete(`/content/${id}`);
  },

  uploadFile: async (fileData) => {
    return await api.post('/content/upload', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};