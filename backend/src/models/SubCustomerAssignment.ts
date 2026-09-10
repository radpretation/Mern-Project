import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCustomerAssignment extends Document {
  legacyId?: number;
  customerId: mongoose.Types.ObjectId; // Sub-customer user ID
  legacyCustomerId?: number;
  processId: string; // Process ID or comma-separated IDs
  createdAt: Date;
  updatedAt: Date;
}

const SubCustomerAssignmentSchema = new Schema<ISubCustomerAssignment>(
  {
    legacyId: { type: Number, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyCustomerId: { type: Number },
    processId: { type: String, required: true },
  },
  { timestamps: true }
);

export const SubCustomerAssignment = mongoose.model<ISubCustomerAssignment>(
  'SubCustomerAssignment',
  SubCustomerAssignmentSchema
);
