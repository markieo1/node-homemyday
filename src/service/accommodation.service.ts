import { Accommodation, IAccommodationModel } from '../model/accommodation.model';
import { IAccommodationDocument } from '../model/schemas/accommodation.schema';

export class AccommodationService {

    /**
     * Gets a list of accommodations
     * @returns All accommodations from the Mongo database.
     */
    public static async getAccommodations() {
        return await Accommodation.find({});
    }

    /**
     * Gets an accommodation of the ID
     * @param id The Object ID to search by.
     * @returns A single accommodation.
     */
    public static async getAccommodation(id: string) {
        return await Accommodation.findById(id);
    }

    /**
     * Create a new accomodation
     * @param accomodation the accomodation object.
     * @returns A new accommodation.
     */
    public static async addAccommodation(accommodation: IAccommodationDocument) {
        return await Accommodation.create(accommodation);
    }

    /**
     * Deletes an accommodation of the ID
     * @param id The Object ID to delete.
     */
    public static async deleteAccommodation(id) {
        return await Accommodation.findByIdAndRemove(id);
    }
}