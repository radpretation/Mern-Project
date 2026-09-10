import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/process-stats', analyticsController.getProcessStats);

export default router;
