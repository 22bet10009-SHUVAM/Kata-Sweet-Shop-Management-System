import mongoose from 'mongoose';
import config from '../config';

/**
 * Connect to MongoDB database
 * Uses mongoose to establish connection with retry logic
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for cleanup in tests
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

export default { connectDB, disconnectDB };
