import client from './axiosClient.js';

const chatApi = {
  list: (partnerId) => client.get(`/api/chat/${partnerId}`),
  send: (payload) => client.post('/api/chat', payload)
};

export default chatApi;
