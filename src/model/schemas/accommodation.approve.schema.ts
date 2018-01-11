import { Document, Schema } from 'mongoose';

export enum ApproveStatus {
    Awaiting = 'Awaiting',
    Approved = 'Approved',
    Rejected = 'Rejected'
  }

export interface IAccommodationApproveDocument extends Document {
    approveStatus: ApproveStatus;
    reason: string;
}

export const AccommodationApproveSchema: Schema = new Schema({
    approveStatus: {
        type: String,
        enum: ApproveStatus,
        default: ApproveStatus.Awaiting
    },
    reason: String
});
