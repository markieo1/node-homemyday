import { Document, Schema } from 'mongoose';

export interface IImageDocument extends Document {
    uuid: string;
    filename: string;
    title: string;
    fileSize: number;
}

export const ImageSchema: Schema = new Schema({
    uuid: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    title: {
        type: String
    }
});
