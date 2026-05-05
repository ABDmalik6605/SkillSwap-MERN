import client from './axiosClient.js';

const authApi = {
  login: (payload) => client.post('/api/auth/login', payload),
  register: (payload) => client.post('/api/auth/register', payload),
  me: () => client.get('/api/auth/me')
};

export default authApi;
