import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('User not found. Please sign up first.');
    } else {
      console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Usage: node src/scripts/makeAdmin.js <email>');
  process.exit(1);
}

makeAdmin(email);
