import User from '../models/User.js';
import { computeMatchScore } from '../utils/aiMatcher.js';

export const getUsers = async (req, res, next) => {
  try {
    const { skill, location, q } = req.query;
    const query = {};
    
    // Exclude current user from results
    if (req.user?._id) {
      query._id = { $ne: req.user._id };
    }
    
    if (skill) {
      query.$or = [
        { 'skillsToTeach.name': new RegExp(skill, 'i') },
        { 'skillsToLearn.name': new RegExp(skill, 'i') }
      ];
    }
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    if (q) {
      query.name = new RegExp(q, 'i');
    }

    const users = await User.find(query).select('-password');
    const enhanced = users
      .map((user) => ({
        ...user.toObject(),
        matchScore: computeMatchScore({
          seekerSkills: req.user?.skillsToLearn?.map((s) => s.name) || [],
          teacherSkills: user.skillsToTeach?.map((s) => s.name) || [],
          seekerLocation: req.user?.location,
          teacherLocation: user.location
        })
      }))
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return (b.rating || 0) - (a.rating || 0);
      });

    res.json(enhanced);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await User.findById(req.params.id).select('-password');
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    
    console.log('UpdateProfile: Received updates:', {
      userId: req.user._id,
      hasSkillsToTeach: !!updates.skillsToTeach,
      skillsToTeachCount: updates.skillsToTeach?.length || 0,
      skillsToTeach: updates.skillsToTeach,
      hasSkillsToLearn: !!updates.skillsToLearn,
      skillsToLearnCount: updates.skillsToLearn?.length || 0,
      skillsToLearn: updates.skillsToLearn,
      allUpdates: updates
    });
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    
    console.log('UpdateProfile: Updated user:', {
      userId: user._id,
      skillsToTeach: user.skillsToTeach,
      skillsToLearn: user.skillsToLearn
    });
    
    res.json(user);
  } catch (error) {
    console.error('UpdateProfile: Error updating user:', error);
    next(error);
  }
};

export const getWhatsAppLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.whatsappNumber) {
      return res.status(404).json({ message: 'WhatsApp number unavailable' });
    }
    res.json({ link: `https://wa.me/${user.whatsappNumber}` });
  } catch (error) {
    next(error);
  }
};
