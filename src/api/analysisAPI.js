import api from './baseAPI';

export const analysisAPI = {
  uploadMatchRecord: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/analyze/upload', formData, {
      timeout: 300000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getMyRecords: () => api.get('/analyze/my-records'),

  getRankings: (params) => api.get('/analyze/rankings', {
    params: params ?? {},
  }),

  getPlayerRecords: (playerName) => {
    const normalizedPlayerName = playerName?.trim();

    if (!normalizedPlayerName) {
      return Promise.reject(new Error('플레이어 이름이 필요합니다.'));
    }

    return api.get('/analyze/player-records', {
      params: { playerName: normalizedPlayerName },
    });
  },

  getPublicRecordDetail: (gameId) => api.get(`/analyze/records/${gameId}`),

  getRecordDetail: (gameId) => api.get(`/analyze/${gameId}`),

  updateDraft: (gameId, payload) => api.put(`/analyze/${gameId}/draft`, payload),

  confirmDraft: (gameId) => api.post(`/analyze/${gameId}/confirm`),
};

export default analysisAPI;
