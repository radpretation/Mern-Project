import mongoose, { Schema, Document } from 'mongoose';

export interface ITestingService extends Document {
  legacyId?: number;
  testingName: string;
  status: number; // 0 = Active, 1 = Inactive
  createdAt: Date;
  updatedAt: Date;
}

const TestingServiceSchema = new Schema<ITestingService>(
  {
    legacyId: { type: Number, index: true },
    testingName: { type: String, required: true },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TestingService = mongoose.model<ITestingService>('TestingService', TestingServiceSchema);
