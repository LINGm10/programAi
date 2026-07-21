import api from './api';

export const getTopRated = (params) => api.get('/rankings/top-rated', { params });
export const getMostReviewed = (params) => api.get('/rankings/most-reviewed', { params });
export const getTrending = (params) => api.get('/rankings/trending', { params });
