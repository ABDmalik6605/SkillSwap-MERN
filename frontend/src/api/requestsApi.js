import client from './axiosClient.js';

const requestsApi = {
  list: () => client.get('/api/requests'),
  create: (payload) => client.post('/api/requests', payload),
  respond: (id, payload) => client.patch(`/api/requests/${id}`, payload)
};

export default requestsApi;
