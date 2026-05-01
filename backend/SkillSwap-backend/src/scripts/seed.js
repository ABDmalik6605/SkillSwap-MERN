import { connectDb, disconnectDb } from '../config/db.js';
import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import Booking from '../models/Booking.js';

const run = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Seed script is intended for development only');
    process.exit(0);
  }

  await connectDb();
  await Promise.all([User.deleteMany(), SwapRequest.deleteMany(), Booking.deleteMany()]);

  const [alex, sam] = await User.create([
    {
      name: 'Alex Mentor',
      email: 'alex@example.com',
      password: 'password123',
      location: 'NYC',
      whatsappNumber: '15551234567',
      skillsToTeach: [{ name: 'Guitar', level: 'advanced' }],
      skillsToLearn: [{ name: 'Spanish', level: 'beginner' }]
    },
    {
      name: 'Sam Learner',
      email: 'sam@example.com',
      password: 'password123',
      location: 'NYC',
      whatsappNumber: '15559876543',
      skillsToTeach: [{ name: 'Spanish', level: 'advanced' }],
      skillsToLearn: [{ name: 'Guitar', level: 'intermediate' }]
    }
  ]);

  const request = await SwapRequest.create({
    fromUser: alex._id,
    toUser: sam._id,
    offeredSkill: 'Guitar',
    requestedSkill: 'Spanish',
    description: 'Let\'s trade lessons!'
  });

  await Booking.create({
    request: request._id,
    confirmedSchedule: new Date(Date.now() + 86400000),
    meetingType: 'online'
  });

  console.log('Seed data created');
  await disconnectDb();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
