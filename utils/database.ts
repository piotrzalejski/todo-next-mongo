import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'todoDB',
    });
    console.log('Database connected');
    const db = mongoose.connection;
    return db;
  } catch (error) {
    console.error('Error connecting to database', error);
  }
};
