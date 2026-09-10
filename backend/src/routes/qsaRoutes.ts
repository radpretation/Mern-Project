import { Router } from 'express';
import { qsaController } from '../controllers/qsaController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { verifyDeviceCertificate } from '../middleware/verifyDeviceCertificate';
import { UserType } from '../constants/roles';
import { uploadQsaStorage } from '../controllers/fileController';

const router = Router();

router.use(requireAuth, requireRole([UserType.QSA]), verifyDeviceCertificate);

router.get('/dashboard', qsaController.getDashboard);
router.get('/audit-view', qsaController.getAuditView);
router.put('/evidence/status', qsaController.updateStatus);
router.post('/evidence/upload-supplementary', uploadQsaStorage.array('files', 10), qsaController.uploadSupplementary);
router.delete('/supplementary-docs/:id', qsaController.deleteSupplementary);
router.post('/evidence/request-modification', qsaController.requestModification);

export default router;
