import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createReview, listReviews } from '../controllers/reviewsController.js';

const router = Router();

router.get('/', listReviews);
router.get('/:userId', listReviews);
router.post(
  '/',
  authenticate,
  validate(
    Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      text: Joi.string().allow(''),
      toUser: Joi.string().required(),
      booking: Joi.string().required()
    })
  ),
  createReview
);

export default router;
