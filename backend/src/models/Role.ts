import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  legacyId?: number;
  roleName: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    legacyId: { type: Number, index: true },
    roleName: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', RoleSchema);
