import api from './api';

export const createReview = (formData) => api.post('/reviews', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const getReviews = (restaurantId, params) => api.get(`/reviews/${restaurantId}`, { params });

export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);

export const deleteReview = (id) => api.delete(`/reviews/${id}`);
