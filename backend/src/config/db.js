import mongoose from 'mongoose';
import config from './index.js';

mongoose.set('strictQuery', true);

export const connectDb = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Mongo connected');
  } catch (error) {
    console.error('Mongo connection error', error.message);
    throw error;
  }
};

export const disconnectDb = async () => {
  await mongoose.connection.close();
};
