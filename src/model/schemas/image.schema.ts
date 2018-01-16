import { Document, Schema } from 'mongoose';

export interface IImageDocument extends Document {
    uuid: string;
    title: string;
}
