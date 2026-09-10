import mongoose, { Schema, Document } from 'mongoose';

export interface IArchivedProcess extends Document {
  legacyId?: number;
  processId: mongoose.Types.ObjectId;
  legacyProcessId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArchivedProcessSchema = new Schema<IArchivedProcess>(
  {
    legacyId: { type: Number, index: true },
    processId: { type: Schema.Types.ObjectId, ref: 'CustomerProcess', required: true, index: true },
    legacyProcessId: { type: Number },
  },
  { timestamps: true }
);

export const ArchivedProcess = mongoose.model<IArchivedProcess>(
  'ArchivedProcess',
  ArchivedProcessSchema
);
