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
    public static async getAccommodation(id: string) {
        return await Accommodation.findById(id);
    }

    /**
     * @param id The Object ID to delete.
     */
    public static async deleteAccommodation(id) {
        return await Accommodation.remove(id);
    }
}
