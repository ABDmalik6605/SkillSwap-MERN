import User from '../models/User.js';
import SwapRequest from '../models/SwapRequest.js';
import Booking from '../models/Booking.js';
import Blog from '../models/Blog.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await SwapRequest.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    
    // Recent activity
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email createdAt');
    const recentRequests = await SwapRequest.find().sort('-createdAt').limit(5).populate('sender receiver', 'name');

    // Growth stats (simulated for simplicity, or could be monthly counts)
    const statsByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalRequests,
        totalBookings,
        totalBlogs
      },
      recentActivity: {
        users: recentUsers,
        requests: recentRequests
      },
      roles: statsByRole
    });
  } catch (error) {
    next(error);
  }
};
