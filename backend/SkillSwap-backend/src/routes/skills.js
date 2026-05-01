import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listSkills, createSkill } from '../controllers/skillsController.js';

const router = Router();

router.get('/', listSkills);
router.post(
  '/',
  authenticate,
  validate(
    Joi.object({
      name: Joi.string().required(),
      category: Joi.string().allow(''),
      tags: Joi.array().items(Joi.string())
    })
  ),
  createSkill
);

export default router;
