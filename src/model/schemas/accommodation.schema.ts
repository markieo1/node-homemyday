import { Document, Schema } from 'mongoose';
import { AccommodationApprove } from '../accommodation.approve.model';
import { ApproveStatus } from './accommodation.approve.schema';

export interface IAccommodationDocument extends Document {
    name: string;
    description: string;
    maxPersons: number;
    continent: string;
    country: string;
    location: string;
    latitude: string;
    longitude: string;
    rooms: number;
    beds: number;
    recommended: boolean;
    price: string;
    spaceText: string;
    servicesText: string;
    pricesText: string;
    rulesText: string;
    cancellationText: string;
    approveStatus: ApproveStatus;
    /**
     * The id of the user that created this accommodation
     */
    userId: Schema.Types.ObjectId;
}

export const AccommodationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    maxPersons: {
        type: Number,
        required: true
    },
    continent: String,
    country: String,
    location: String,
    latitude: String,
    longitude: String,
    rooms: Number,
    beds: Number,
    recommended: {
        type: Boolean,
        default: false
    },
    price: {
        type: String,
        required: true
    },
    spaceText: String,
    servicesText: String,
    pricesText: String,
    rulesText: String,
    cancellationText: String,
    approveStatus: {
        type: AccommodationApprove,
        default: ApproveStatus.Awaiting
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

// Add id prop to the json and remove _id and __v from the json when sending the json
AccommodationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => { delete ret._id; }
});
