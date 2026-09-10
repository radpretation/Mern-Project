import mongoose, { Schema, Document } from 'mongoose';

export interface ICmsPage extends Document {
  legacyId?: number;
  name: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CmsPageSchema = new Schema<ICmsPage>(
  {
    legacyId: { type: Number, index: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const CmsPage = mongoose.model<ICmsPage>('CmsPage', CmsPageSchema);
