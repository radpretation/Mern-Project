import crypto from 'crypto';
import { Request } from 'express';

/**
 * Legacy formula: md5($_SERVER['HTTP_USER_AGENT'].$_SERVER['LOCAL_ADDR'].$_SERVER['LOCAL_PORT'].$_SERVER['REMOTE_ADDR'])
 */
export function computeDeviceFingerprint(req: Request): string {
  const userAgent = req.headers['user-agent'] || '';
  const remoteAddr = req.ip || req.socket.remoteAddress || '';
  const host = req.headers['host'] || '';
  const raw = `${userAgent}${host}${remoteAddr}`;
  return crypto.createHash('md5').update(raw).digest('hex');
}
