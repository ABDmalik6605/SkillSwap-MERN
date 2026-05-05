import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getAdminStats);

export default router;
