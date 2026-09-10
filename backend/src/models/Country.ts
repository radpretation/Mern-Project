import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  legacyId?: number;
  iso: string;
  name: string;
  nicename: string;
  phonecode: number;
}

const CountrySchema = new Schema<ICountry>({
  legacyId: { type: Number, index: true },
  iso: { type: String, required: true },
  name: { type: String, required: true },
  nicename: { type: String, required: true },
  phonecode: { type: Number, required: true },
});

export const Country = mongoose.model<ICountry>('Country', CountrySchema);
