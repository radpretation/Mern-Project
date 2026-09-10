import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceReport extends Document {
  legacyId?: number;
  serviceId: number;
  processId: mongoose.Types.ObjectId;
  legacyProcessId?: number;
  customerId: mongoose.Types.ObjectId;
  legacyCustomerId?: number;
  userId: mongoose.Types.ObjectId;
  legacyUserId?: number;
  reportDocs: string; // Filename in uploads/report/
  reportOf: 'AOC' | 'ROC' | 'AOT' | 'ROT';
  date: string; // YYYY-MM-DD
  year: number; // Assessment fiscal year
  originalFilename?: string;
  fileSize?: number;
  mimeType?: string;
  sha256Checksum?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceReportSchema = new Schema<IComplianceReport>(
  {
    legacyId: { type: Number, index: true },
    serviceId: { type: Number, required: true, index: true },
    processId: { type: Schema.Types.ObjectId, ref: 'CustomerProcess', required: true, index: true },
    legacyProcessId: { type: Number },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyCustomerId: { type: Number },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    legacyUserId: { type: Number },
    reportDocs: { type: String, required: true },
    reportOf: { type: String, enum: ['AOC', 'ROC', 'AOT', 'ROT'], required: true, index: true },
    date: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    originalFilename: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
    sha256Checksum: { type: String },
  },
  { timestamps: true }
);

export const ComplianceReport = mongoose.model<IComplianceReport>(
  'ComplianceReport',
  ComplianceReportSchema
);
