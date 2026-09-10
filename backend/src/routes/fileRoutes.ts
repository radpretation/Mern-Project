import { Router } from 'express';
import { fileController, uploadReportStorage } from '../controllers/fileController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { UserType } from '../constants/roles';

const router = Router();

router.get('/download', fileController.downloadFile);
router.get('/:type/:filename', fileController.downloadFile);
router.post('/reports/upload', requireAuth, requireRole([UserType.ADMIN]), uploadReportStorage.single('report'), fileController.uploadReport);

export default router;
