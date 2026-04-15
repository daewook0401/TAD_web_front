import api from './baseAPI';

export const analysisAPI = {
  uploadMatchRecord: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/analyze/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default analysisAPI;
