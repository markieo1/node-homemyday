import { IImageDocument } from '../model/schemas/image.schema';
import { AccommodationService } from './accommodation.service';

export class ImageService {
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
}
