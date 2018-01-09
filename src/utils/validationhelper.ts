import * as Mongoose from 'mongoose';

export class ValidationHelper {

    /**
     * Checks if a variable is a valid MongoDB id.
     * @param id The ID to check.
     * @returns true if the ID is a valid MongoDB id, otherwise returns false.
     */
    public static isValidMongoId(id): boolean {
        return Mongoose.Types.ObjectId.isValid(id);
    }
}
