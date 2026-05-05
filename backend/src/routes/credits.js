import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { getCredits, addTransaction } from '../controllers/creditsController.js';

const router = Router();

const txSchema = Joi.object({
  type: Joi.string().valid('credit', 'debit').required(),
  amount: Joi.number().integer().min(1).required(),
  description: Joi.string().min(3).max(200).required(),
  relatedBooking: Joi.string().optional()
});

router.get('/', authenticate, getCredits);
router.post('/', authenticate, validate(txSchema), addTransaction);

export default router;
