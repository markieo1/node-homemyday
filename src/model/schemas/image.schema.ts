import { Document, Schema } from 'mongoose';

export interface IImageDocument extends Document {
    uuid: string;
    title: string;
}

export const ImageSchema: Schema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String
    }
});
