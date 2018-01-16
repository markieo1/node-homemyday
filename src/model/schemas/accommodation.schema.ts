import { Document, Schema } from 'mongoose';
import { IImageDocument, ImageSchema } from './image.schema';

export enum ApproveStatus {
    Awaiting = 'Awaiting',
    Approved = 'Approved',
    Rejected = 'Rejected'
}

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
    price: number;
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

    /**
     * The images of this accommodation. Contains the relative URLs to them.
     */
    images: [IImageDocument];
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
        type: Number,
        required: true
    },
    spaceText: String,
    servicesText: String,
    pricesText: String,
    rulesText: String,
    cancellationText: String,
    approveStatus: {
        type: ApproveStatus,
        default: ApproveStatus.Awaiting
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    bookings: [{
        bookingId: Number,
        dateFrom: Date,
        dateTo: Date
    }],
    images: [ImageSchema]
});

// Store prices as cents to prevent floating point errors
// Result is wrapped in a Number() call to prevent trailing zeroes
AccommodationSchema.path('price').get((num) => {
    return Number((num / 100).toFixed(2));
});

AccommodationSchema.path('price').set((num) => {
    return num * 100;
});

// Add id prop to the json and remove _id and __v from the json when sending the json
AccommodationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    getters: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.bookings;
    }
});

// Make getters work on find
AccommodationSchema.set('toObject', {
    getters: true
});
