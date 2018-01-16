import { Document, Model, model, Schema } from 'mongoose';
import { IImageDocument, ImageSchema } from './schemas/image.schema';

export interface IImageModel extends Model<IImageDocument> { }
export const Image = model<IImageDocument, IImageModel>('Image', ImageSchema);

export default Image;
