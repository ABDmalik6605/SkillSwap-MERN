import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      fromUser: req.user._id
    };
    const review = await Review.create(payload);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const listReviews = async (req, res, next) => {
  try {
    const filter = req.params.userId ? { toUser: req.params.userId } : {};
    const reviews = await Review.find(filter)
      .populate('fromUser toUser', 'name avatarUrl')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
