import { Document, Schema } from 'mongoose';
import { ApproveStatus } from '../schemas/accommodation.schema';

export interface IApproveStatusDocument extends Document {
    status: ApproveStatus;
    reason: string;
}

export const ApproveStatusSchema: Schema = new Schema({
    status: {
        type: String
    },
    reason: {
        type: String
    }
});
