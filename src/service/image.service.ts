import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { Config } from '../config/config.const';
import { ImageError } from '../errors/index';
import { IImageDocument } from '../model/schemas/image.schema';
import { AccommodationService } from './accommodation.service';

export class ImageService {
    /**
     * Promised version of fs.unlink
     */
    public static unlinkFile = util.promisify(fs.unlink);

    /**
     * Adds an image to the accommodation
     * @param accommodationId The accommodation id to add the image to
     * @param file The saved file
     * @param title The title of the image
     */
    public static async addImage(accommodationId: string, file: Express.Multer.File, title: string) {
        const accommodation = await AccommodationService.getAccommodation(accommodationId);

        const uuid = file.filename.replace(path.extname(file.filename), '');

        const image = {
            uuid,
            filename: file.filename,
            fileSize: file.size,
            title
        } as IImageDocument;

        accommodation.images.push(image);
        await accommodation.save();
        return image;
    }

    /**
     * Deletes an image from an accommodation
     * @param accommodationId The accommodation id to delete the image for
     * @param filename The uuid to delete
     */
    public static async deleteImage(accommodationId: string, uuid: string) {
        const accommodation = await AccommodationService.getAccommodation(accommodationId);

        const image = accommodation.images.find((i) => i.uuid === uuid);
        if (!image) {
            throw new ImageError('Image not found!');
        }

        accommodation.images.splice(accommodation.images.indexOf(image), 1);

        await accommodation.save();

        // Now remove the file
        await ImageService.unlinkFile(`${Config.imagePath}/${image.filename}`);
    }
}
