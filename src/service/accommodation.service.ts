import { Accommodation, IAccommodationModel } from '../model/accommodation.model';

export class AccommodationService {

    /**
     * @returns All accommodations from the Mongo database.
     */
    public static async getAccommodations() {
        return await Accommodation.find({});
    }

    /**
     * @param id The Object ID to search by.
     * @returns A single accommodation.
     */
    public static async getAccommodation(id) {
        return await Accommodation.findById(id);
    }
}
