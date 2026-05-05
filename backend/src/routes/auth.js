import { Router } from 'express';
import Joi from 'joi';
import { register, login, me } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  whatsappNumber: Joi.string().pattern(/^[0-9]+$/).allow('').optional(),
  bio: Joi.string().max(500).allow('').optional(),
  location: Joi.string().allow('').optional(),
  skillsToTeach: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
      tags: Joi.array().items(Joi.string()).default([])
    })
  ).default([]),
  skillsToLearn: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
      tags: Joi.array().items(Joi.string()).default([])
    })
  ).default([])
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticate, me);

export default router;
