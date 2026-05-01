import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap',
  jwtSecret: process.env.JWT_SECRET || 'local-secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  email: {
    sender: process.env.EMAIL_SENDER || 'noreply@skillswap.local',
    smtpHost: process.env.SMTP_HOST || 'smtp.skillswap.local',
    smtpPort: Number(process.env.SMTP_PORT) || 1025,
    smtpUser: process.env.SMTP_USER || 'smtp-user',
    smtpPass: process.env.SMTP_PASS || 'smtp-pass'
  }
};

export default config;
