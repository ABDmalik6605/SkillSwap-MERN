import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listMessages, sendMessage } from '../controllers/chatController.js';

const router = Router();

router.use(authenticate);
router.get('/:partnerId', listMessages);
router.post('/', validate(Joi.object({ to: Joi.string().required(), text: Joi.string().required() })), sendMessage);

export default router;
