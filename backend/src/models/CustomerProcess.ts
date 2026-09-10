import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerProcess extends Document {
  legacyId?: number;
  customerId: mongoose.Types.ObjectId;
  legacyCustomerId?: number;
  assignedCustomerId?: string;
  processName: string;
  status: number; // 0 = Active, 1 = Inactive / Archived
  createdAt: Date;
  updatedAt: Date;
}

const CustomerProcessSchema = new Schema<ICustomerProcess>(
  {
    legacyId: { type: Number, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyCustomerId: { type: Number },
    assignedCustomerId: { type: String, default: '' },
    processName: { type: String, required: true },
    status: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const CustomerProcess = mongoose.model<ICustomerProcess>('CustomerProcess', CustomerProcessSchema);
