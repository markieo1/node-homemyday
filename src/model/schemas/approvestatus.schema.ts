import { Document, Schema } from 'mongoose';
import { ApproveStatus } from '../schemas/accommodation.schema';

export interface IApproveStatusDocument extends Document {
    approveStatus: ApproveStatus;
    reason: string;
}

export const ApproveStatusSchema: Schema = new Schema({
    approveStatus: {
        type: ApproveStatus
    },
    reason: {
        type: String
    }
});
