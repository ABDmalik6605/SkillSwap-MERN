import mongoose from 'mongoose';
import app from '../src/app.js';

// MongoDB connection state
let isConnected = false;

// Simple MongoDB connection function for Vercel
const connectToDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
    
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isConnected = false;
    throw error;
  }
};

const handler = async (req, res) => {
  // Set CORS headers first
  const origin = req.headers.origin;
  const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['*'];
  
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin || allowedOrigins[0] || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to database
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({ 
      error: 'Database unavailable',
      message: 'Unable to connect to database'
    });
  }
  
  // Handle request with Express
  return app(req, res);
};

export default handler;

