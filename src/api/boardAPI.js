import api from './baseAPI';

const appendJsonPart = (formData, value) => {
  formData.append(
    'request',
    new Blob([JSON.stringify(value)], {
      type: 'application/json',
    })
  );
};

export const boardAPI = {
  getCategories: () => api.get('/board/categories'),

  getPosts: (params = {}) => {
    const { categoryKey, postType, page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams();

    if (categoryKey) queryParams.append('categoryKey', categoryKey);
    if (postType && postType !== 'all') queryParams.append('postType', postType);
    queryParams.append('page', page);
    queryParams.append('size', size);

    return api.get(`/board/posts?${queryParams.toString()}`);
  },

  getPost: (postId) => api.get(`/board/posts/${postId}`),

  createPostFormData: ({ payload, files = [] }) => {
    const formData = new FormData();
    appendJsonPart(formData, payload);

    files.forEach((file) => {
      formData.append('files', file);
    });

    return api.post('/board/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updatePostFormData: ({ postId, payload, files = [] }) => {
    const formData = new FormData();
    appendJsonPart(formData, payload);

    files.forEach((file) => {
      formData.append('files', file);
    });

    return api.put(`/board/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deletePost: (postId) => api.delete(`/board/posts/${postId}`),

  getComments: (postId) => api.get(`/board/posts/${postId}/comments`),

  createCommentFormData: ({ postId, payload, images = [] }) => {
    const formData = new FormData();
    appendJsonPart(formData, payload);

    images.forEach((file) => {
      formData.append('images', file);
    });

    return api.post(`/board/posts/${postId}/comments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateComment: (commentId, payload) => api.put(`/board/comments/${commentId}`, payload),

  deleteComment: (commentId) => api.delete(`/board/comments/${commentId}`),

  likePost: (postId) => api.post(`/board/posts/${postId}/like`),

  unlikePost: (postId) => api.delete(`/board/posts/${postId}/like`),
};

export default boardAPI;
