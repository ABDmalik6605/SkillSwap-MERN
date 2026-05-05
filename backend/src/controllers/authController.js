import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

export const register = async (req, res, next) => {
  try {
    const { email, password, name, whatsappNumber, skillsToTeach, skillsToLearn, bio, location } = req.body;
    
    console.log('Register: Received request body:', {
      email,
      name,
      hasSkillsToTeach: !!skillsToTeach,
      skillsToTeachCount: skillsToTeach?.length || 0,
      skillsToTeach,
      hasSkillsToLearn: !!skillsToLearn,
      skillsToLearnCount: skillsToLearn?.length || 0,
      skillsToLearn
    });
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    const user = await User.create({ 
      email, 
      password, 
      name, 
      whatsappNumber,
      skillsToTeach: skillsToTeach || [],
      skillsToLearn: skillsToLearn || [],
      bio,
      location
    });
    
    console.log('Register: Created user with skills:', {
      userId: user._id,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn
    });
    
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Register: Error creating user:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const meUser = await User.findById(req.user._id).select('-password');
    res.json(meUser);
  } catch (error) {
    next(error);
  }
};
