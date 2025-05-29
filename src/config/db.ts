import mongoose from 'mongoose';

import envConfig from './env';

const { MONGODB_URL } = envConfig;
let isConnected = false; 
export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URL!);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};