import { Document, Model, model, Schema } from 'mongoose';
import { AccommodationApproveSchema, IAccommodationApproveDocument } from './schemas/accommodation.approve.schema';

export interface IAccommodationApproveModel extends Model<IAccommodationApproveDocument> { }
export const AccommodationApprove = model<IAccommodationApproveDocument,
        IAccommodationApproveModel>('AccommodationApprove', AccommodationApproveSchema);

export default AccommodationApprove;
