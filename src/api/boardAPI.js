import api from './baseAPI';

export const boardAPI = {
  // 카테고리 목록 조회
  getCategories: () => api.get('/board/categories'),
  
  // 게시글 목록 조회
  getPosts: (params = {}) => {
    const { categoryKey, postType, page = 0, size = 20 } = params;
    const queryParams = new URLSearchParams();
    
    if (categoryKey) queryParams.append('categoryKey', categoryKey);
    if (postType && postType !== 'all') queryParams.append('postType', postType);
    queryParams.append('page', page);
    queryParams.append('size', size);
    
    return api.get(`/board/posts?${queryParams.toString()}`);
  },
  
  // 게시글 상세 조회
  getPost: (postId) => api.get(`/board/posts/${postId}`),
};

export default boardAPI;
