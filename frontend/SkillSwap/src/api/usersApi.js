import client from './axiosClient.js';

const usersApi = {
  list: (params) => client.get('/api/users', { params }),
  getProfile: (id) => client.get(`/api/users/${id}`),
  updateProfile: (payload) => client.patch('/api/users/me', payload),
  whatsappLink: (id) => client.get(`/api/users/${id}/whatsapp`)
};

export default usersApi;
