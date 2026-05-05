import client from './axiosClient.js';

const reviewsApi = {
  list: (userId) => client.get(userId ? `/api/reviews/${userId}` : '/api/reviews'),
  create: (payload) => client.post('/api/reviews', payload)
};

export default reviewsApi;
