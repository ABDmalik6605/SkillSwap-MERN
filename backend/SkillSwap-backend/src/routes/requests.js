import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createRequest, listRequests, respondToRequest } from '../controllers/requestsController.js';

const router = Router();

const requestSchema = Joi.object({
  toUser: Joi.string().required(),
  offeredSkill: Joi.string().required(),
  requestedSkill: Joi.string().required(),
  description: Joi.string().allow(''),
  scheduleProposals: Joi.array().items(
    Joi.object({ proposedTime: Joi.date().required(), note: Joi.string().allow('') })
  )
});

router.use(authenticate);
router.post('/', validate(requestSchema), createRequest);
router.get('/', listRequests);
router.patch(
  '/:id',
  validate(
    Joi.object({
      status: Joi.string().valid('pending', 'accepted', 'completed', 'rejected', 'cancelled').required(),
      confirmedSchedule: Joi.date().optional(),
      meetingType: Joi.string().valid('online', 'in-person').optional(),
      durationMinutes: Joi.number().optional()
    })
  ),
  respondToRequest
);

export default router;
