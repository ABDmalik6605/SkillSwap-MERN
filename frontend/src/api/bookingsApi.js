import client from './axiosClient.js';

const bookingsApi = {
  list: () => client.get('/api/bookings'),
  create: (payload) => client.post('/api/bookings', payload),
  complete: (id) => client.patch(`/api/bookings/${id}/complete`)
};

export default bookingsApi;
