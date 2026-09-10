import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceService extends Document {
  legacyId?: number;
  serviceName: string;
  status: number; // 0 = Inactive, 1 = Active
  fetchId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceServiceSchema = new Schema<IComplianceService>(
  {
    legacyId: { type: Number, index: true },
    serviceName: { type: String, required: true },
    status: { type: Number, default: 1 },
    fetchId: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ComplianceService = mongoose.model<IComplianceService>('ComplianceService', ComplianceServiceSchema);
