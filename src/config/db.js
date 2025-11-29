import mongoose from 'mongoose';

const { MONGODB_URI = 'mongodb://127.0.0.1:27017/online-event' } = process.env;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', error);
    throw error;
  }
};

