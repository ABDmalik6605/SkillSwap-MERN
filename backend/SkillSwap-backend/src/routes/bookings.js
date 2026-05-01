import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listBookings, createBooking, completeBooking } from '../controllers/bookingsController.js';

const router = Router();

router.use(authenticate);

router.get('/', listBookings);
router.post(
  '/',
  validate(
    Joi.object({
      request: Joi.string().required(),
      confirmedSchedule: Joi.date().required(),
      durationMinutes: Joi.number().min(15).default(60),
      meetingType: Joi.string().valid('online', 'in-person').default('online'),
      notes: Joi.string().allow('')
    })
  ),
  createBooking
);
router.patch('/:id/complete', completeBooking);

export default router;
