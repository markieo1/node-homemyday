import { Document, Model, model, Schema } from 'mongoose';
import { AccommodationApproveSchema, IAccommodationApproveDocument } from './schemas/accommodation.approve.schema';

export interface IAccommodationModel extends Model<IAccommodationApproveDocument> { }
export const AccommodationApprove = model<IAccommodationApproveDocument,
                IAccommodationModel>('AccommodationApprove', AccommodationApproveSchema);

export default AccommodationApprove;
