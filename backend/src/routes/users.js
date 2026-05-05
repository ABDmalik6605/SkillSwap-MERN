import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { getProfile, getUsers, updateProfile, getWhatsAppLink } from '../controllers/usersController.js';

const router = Router();

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(80).optional(),
  bio: Joi.string().max(500).allow('').optional(),
  location: Joi.string().allow('').optional(),
  avatarUrl: Joi.string().uri().optional(),
  whatsappNumber: Joi.string().pattern(/^[0-9]+$/).allow('').optional(),
  skillsToTeach: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
      tags: Joi.array().items(Joi.string()).default([])
    })
  ).optional(),
  skillsToLearn: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
      tags: Joi.array().items(Joi.string()).default([])
    })
  ).optional(),
  badges: Joi.array().items(Joi.string()).optional()
}).min(1); // At least one field must be provided

router.get('/', getUsers);
router.get('/:id', getProfile);
router.patch('/me', authenticate, validate(profileSchema), updateProfile);
router.get('/:id/whatsapp', authenticate, getWhatsAppLink);

export default router;
