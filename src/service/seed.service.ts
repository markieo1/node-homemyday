import { User } from '../model/user.model';

export class SeedService {

    /**
     * Seeds the administrator user login
     */
    public static seed() {
        const email = 'Administrator@homemyday.nl';
        const password = 'HomeMyDay@123';
        const role = 'Administrator';

        User.count({ email })
            .then((count) => {
                if (count === 0) {
                    const user = new User({
                        email,
                        password,
                        role
                    });

                    user.save();
                }
            });
    }
}
