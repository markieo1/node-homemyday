import { Document, Schema } from 'mongoose';

export interface IOtpDocument extends Document {
  secret: string;
  tempSecret: string;
  dataURL: string;
  otpURL: string;
  enabled: boolean;
}

export const OtpSchema: Schema = new Schema({
  secret: String,
  tempSecret: String,
  dataURL: String,
  otpURL: String,
  enabled: {
    type: Boolean,
    default: false
  }
});
