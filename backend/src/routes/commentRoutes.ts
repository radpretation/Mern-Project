import { Router } from 'express';
import { commentController } from '../controllers/commentController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', commentController.addComment);
router.get('/', commentController.getComments);

export default router;
