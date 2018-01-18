import { AccommodationError } from '../errors/accommodation.error';
import { Accommodation, IAccommodationModel } from '../model/accommodation.model';
import { ApproveStatus, IAccommodationDocument } from '../model/schemas/accommodation.schema';
import { IApproveStatusDocument } from '../model/schemas/approvestatus.schema';
import { ImageService } from './image.service';

export class AccommodationService {

    /**
     * Gets a list of accommodations
     * @returns All accommodations from the Mongo database.
     */
    public static async getAccommodations() {
        return await Accommodation.find({});
    }

    /**
     * Gets a list of awaiting accommodations
     * @returns All awaiting accommodations from the Mongo database.
     */
    public static async getAwaitingAccommodations() {
        return await Accommodation.find({ 'approveStatus.status': ApproveStatus.Awaiting });
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
     * Sets the status and reason of the approveStatus of accommodation
     * @param accommodationId The id of the accommmodation
     * @param approveStatus The approveStatus of accommodation.
     * @param approveStatusReason The reason for rejectal
     */
    public static async updateApproval(accommodationId: string,
                                       approveStatus: ApproveStatus,
                                       approveStatusReason?: string) {

        const accommodation = await this.getAccommodation(accommodationId);

        if (!accommodation) {
            throw new AccommodationError('Accommodation not found!');
        }

        const approveStatusToUpdate = {
            status: approveStatus,
            reason: approveStatusReason
        } as IApproveStatusDocument;

        accommodation.approveStatus = approveStatusToUpdate;

        await accommodation.save();

        return accommodation;
    }

    public static async checkRecommendation(id: string) {

        let accommodation = await AccommodationService.getAccommodation(id);
        if (!accommodation.recommended) {
            accommodation = await AccommodationService.updateRecommend(id);
        } else {
            accommodation = await AccommodationService.revertRecommend(id);
        }
    }

    /**
     * Sets the recommended value of an accommodation to true
     * @param accommodation The object of accommodation.
     */
    public static async updateRecommend(id: string) {

        const accommodation = await this.getAccommodation(id);

        if (!accommodation) {
            throw new AccommodationError('Accommodation not found!');
        }

        accommodation.recommended = true;

        await accommodation.save();

        return accommodation;
    }

    /**
     * Sets the recommended value of an accommodation to false
     * @param accommodation The object of accommodation.
     */
    public static async revertRecommend(id: string) {

        const accommodation = await this.getAccommodation(id);

        if (!accommodation) {
            throw new AccommodationError('Accommodation not found!');
        }

        accommodation.recommended = false;

        await accommodation.save();

        return accommodation;
    }

    /**
     * Gets all accommodations that match the given search parameters.
     * Will only return accommodations that can fit the requested amount of persons.
     * Will also only return accommodations which are not already booked in the requested timeframe.
     * @param location The location of the accommodation.
     * @param from The start date of the search.
     * @param to The end date of the search.
     * @param persons The amount of persons that the accommodation has to hold.
     */
    public static async searchAccommodations(location: string, from: Date, to: Date, persons: number) {

        // Find all accommodations which match or partially match the given location.
        // Filters out any accommodations that are already booked within the given timeframe.
        // https://stackoverflow.com/a/26877645/3714134
        return await Accommodation.find({
            'location': { $regex: location, $options: 'i' },
            'maxPersons': { $gte: persons },
            'bookings': {
                $not: {
                    $elemMatch: { dateFrom: { $lt: to }, dateTo: { $gt: from } }
                }
            },
            'approveStatus.status': ApproveStatus.Approved
        });
    }

    /**
     * Gets the accommodations for one user
     * @param id The id of the user
     */
    public static async getForUser(userId: string) {
        return await Accommodation.find({
            userId
        });
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
     * Updates a single accommodation.
     * @param id The ID of the accommodation to update.
     * @param accommodation The new values for the accommodation.
     */
    public static async updateAccommodation(id: string, accommodation: IAccommodationDocument) {
        return await Accommodation.findByIdAndUpdate(id, accommodation, { new: true });
    }

    /**
     * Deletes an accommodation of the ID
     * @param id The Object ID to delete.
     */
    public static async deleteAccommodation(id) {
        const accommodation = await this.getAccommodation(id);

        if (accommodation) {
            // Remove all the images
            if (accommodation.images) {
                accommodation.images.forEach(async (image) => {
                    await ImageService.deleteImage(accommodation.id, image.uuid);
                });
            }
        }

        return await Accommodation.findByIdAndRemove(id);
    }
}
