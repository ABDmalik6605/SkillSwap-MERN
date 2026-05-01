import client from './axiosClient.js';

const skillsApi = {
  list: () => client.get('/api/skills')
};

export default skillsApi;
