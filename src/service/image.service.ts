import * as fs from 'fs';
import * as util from 'util';
import { Config } from '../config/config.const';
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

        const image = {
            filename: file.filename,
            title
        } as IImageDocument;

        accommodation.images.push(image);
        await accommodation.save();
    }

    /**
     * Deletes an image from an accommodation
     * @param accommodationId The accommodation id to delete the image for
     * @param filename The filename to delete
     */
    public static async deleteImage(accommodationId: string, filename: string) {
        const accommodation = await AccommodationService.getAccommodation(accommodationId);

        accommodation.images.splice(accommodation.images.findIndex((image) => image.filename === filename), 1);

        await accommodation.save();

        // Now remove the file
        await ImageService.unlinkFile(`${Config.imagePath}/${filename}`);
    }
}
