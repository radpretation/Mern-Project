import { idEncode } from '../utils/idObfuscation';
import { IUser } from '../models/User';

export class CertificateService {
  /**
   * Generates 450-character certificate key based on user info seed
   * Matches legacy CodeIgniter formula in admin/Customer.php
   */
  public generateCustomerCertificate(user: IUser): string {
    const seed = `${Date.now()}-${user.legacyId || user._id}${user.fullName}${user.companyNumber || ''}${user.phoneNumber || ''}${user.companyName || ''}`;
    let result = '';
    const seedLength = seed.length;

    for (let i = 0; i < 450; i++) {
      const randomIndex = Math.floor(Math.random() * seedLength);
      result += seed.charAt(randomIndex);
    }
    return result;
  }

  /**
   * Generates Auditor Certificate prefixed with encoded ID
   */
  public generateAuditorCertificate(user: IUser, rolePrefix: string): { filename: string; content: string } {
    const rawKey = this.generateCustomerCertificate(user);
    const encodedId = idEncode(user.legacyId || 1);
    const content = `${encodedId}-${rawKey}`;
    const sanitizedName = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${rolePrefix}_certificate_${sanitizedName}.txt`;
    return { filename, content };
  }
}

export const certificateService = new CertificateService();
