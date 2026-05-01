import axiosClient from './axiosClient.js';

const creditsApi = {
  get: () => axiosClient.get('/api/credits'),
  add: (data) => axiosClient.post('/api/credits', data)
};

export default creditsApi;
