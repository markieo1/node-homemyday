import { UserRoles } from '../model/schemas/user.schema';
import { User } from '../model/user.model';

export class SeedService {

    /**
     * Seeds the administrator user login
     */
    public static async seed() {
        const email = 'Administrator@homemyday.nl';
        const password = 'HomeMyDay@123';
        const role =  UserRoles.Administrator;

        const count = await User.count({ role });
        if (count === 0) {
            const user = new User({
                email,
                password,
                role
            });

            const savedUser = await user.save();
            if (savedUser) {
                return true;
            } else {
                console.log('An error has been occurred while saving the administrator user login.');
            }
        }
    }
}
