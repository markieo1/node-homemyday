import { User } from '../model/user.model';

export class UserService {
    /**
     * Gets an user of the ID
     * @param id The Object ID to search by.
     * @returns A single user.
     */
    public static async getUser(id: string) {
        return await User.findById(id, { password: false });
    }
}
