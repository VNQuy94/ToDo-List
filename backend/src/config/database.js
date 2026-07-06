import mongoose from 'mongoose';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables!');
    }

    // Disable auto-indexing in production for performance
    mongoose.set('autoIndex', process.env.NODE_ENV === 'development');

    const conn = await mongoose.connect(mongoUri);

    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
