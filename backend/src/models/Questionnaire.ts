import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionnaire extends Document {
  legacyId?: number;
  serviceId: number; // Framework ID (1=PCI DSS, 2=ISO, 3=HIPAA, 4=HITRUST, etc.)
  question: string;
  status: '1' | '2'; // '1' = Active, '2' = Inactive
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireSchema = new Schema<IQuestionnaire>(
  {
    legacyId: { type: Number, index: true },
    serviceId: { type: Number, required: true, index: true },
    question: { type: String, required: true },
    status: { type: String, enum: ['1', '2'], default: '1', index: true },
  },
  { timestamps: true }
);

export const Questionnaire = mongoose.model<IQuestionnaire>('Questionnaire', QuestionnaireSchema);
