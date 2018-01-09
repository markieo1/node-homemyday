import { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
    username: string;
    password: string;
    role: string;
}

export const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});
