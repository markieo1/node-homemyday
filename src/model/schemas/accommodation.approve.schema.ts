import { Document, Schema } from 'mongoose';

export enum ApproveStatus {
    Awaiting = 'Awaiting',
    Approved = 'Approved',
    Rejected = 'Rejected'
  }

export interface IAccommodationApproveDocument extends Document {
    status: ApproveStatus;
    reason: string;
}

export const AccommodationApproveSchema: Schema = new Schema({
    status: {
        type: ApproveStatus,
        default: ApproveStatus.Awaiting
    },
    reason: String
});
