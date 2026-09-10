import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { uploadMemoryStorage } from '../controllers/fileController';

const router = Router();

router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getMe);
router.post('/install-certificate', uploadMemoryStorage.single('certificate'), authController.installCertificate);
router.post('/forgot-password', authController.forgotPassword);
router.post('/change-password', requireAuth, authController.changePassword);
router.put('/profile', requireAuth, authController.updateProfile);

export default router;
