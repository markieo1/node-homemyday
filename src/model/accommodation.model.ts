import { Document, Model, model, Schema } from 'mongoose';
import { AccommodationSchema, IAccommodationDocument } from './schemas/accommodation.schema';

export interface IAccommodationModel extends Model<IAccommodationDocument> { }
export const Accommodation = model<IAccommodationDocument, IAccommodationModel>('Accommodation', AccommodationSchema);

export default Accommodation;