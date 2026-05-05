import axiosClient from '../api/axiosClient.js';

export const fetchMatchInsights = async (userId) => {
  const { data } = await axiosClient.get(`/api/users/${userId}`);
  return data.matchScore ?? 0;
};

export const uploadAvatarPlaceholder = async (file) => {
  console.info('Upload placeholder invoked with', file?.name);
  console.info('Replace with Cloudinary/S3 using env keys like', import.meta.env.VITE_CLIENT_ID);
  return 'https://placehold.co/128x128';
};
