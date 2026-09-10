import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditComment extends Document {
  legacyId?: number;
  questionId: mongoose.Types.ObjectId;
  legacyQuestionId?: number;
  serviceId: number;
  processId: mongoose.Types.ObjectId;
  legacyProcessId?: number;
  parentId?: mongoose.Types.ObjectId;
  legacyParentId?: number;
  customerId: mongoose.Types.ObjectId;
  legacyCustomerId?: number;
  loginUserId: mongoose.Types.ObjectId;
  legacyLoginUserId?: number;
  comments: string;
  loginUserDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuditCommentSchema = new Schema<IAuditComment>(
  {
    legacyId: { type: Number, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Questionnaire', required: true, index: true },
    legacyQuestionId: { type: Number, index: true },
    serviceId: { type: Number, required: true, index: true },
    processId: { type: Schema.Types.ObjectId, ref: 'CustomerProcess', required: true, index: true },
    legacyProcessId: { type: Number, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' },
    legacyParentId: { type: Number, default: 0 },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyCustomerId: { type: Number, index: true },
    loginUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    legacyLoginUserId: { type: Number, index: true },
    comments: { type: String, required: true },
    loginUserDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AuditCommentSchema.index({ questionId: 1, processId: 1, serviceId: 1, customerId: 1 });

export const AuditComment = mongoose.model<IAuditComment>('AuditComment', AuditCommentSchema);
