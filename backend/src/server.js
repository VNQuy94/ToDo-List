import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import app from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;

// Initialize server after database connection
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Server] Running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  });
};

startServer();
