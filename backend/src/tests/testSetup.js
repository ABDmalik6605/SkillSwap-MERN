import mongoose from 'mongoose';
import { jest } from '@jest/globals';

beforeAll(async () => {
  jest.setTimeout(30000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
