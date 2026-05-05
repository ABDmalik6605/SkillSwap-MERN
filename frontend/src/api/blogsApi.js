import axiosClient from './axiosClient.js';

const blogsApi = {
  list: (params) => axiosClient.get('/api/blogs', { params }),
  get: (id) => axiosClient.get(`/api/blogs/${id}`),
  create: (data) => axiosClient.post('/api/blogs', data),
  update: (id, data) => axiosClient.patch(`/api/blogs/${id}`, data),
  remove: (id) => axiosClient.delete(`/api/blogs/${id}`)
};

export default blogsApi;
