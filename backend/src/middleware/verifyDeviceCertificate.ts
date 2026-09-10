import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Device certificate verification middleware.
 * Note: Bypass mode enabled per configuration - allows seamless access for all users.
 */
export const verifyDeviceCertificate = async (
  _req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // Bypassed: All authenticated users can access resources without hardware certificates
  return next();
};

