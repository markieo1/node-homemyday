import { Document, Schema } from 'mongoose';

export interface IImageDocument extends Document {
    filename: string;
    title: string;
}

export const ImageSchema: Schema = new Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String
    }
});
