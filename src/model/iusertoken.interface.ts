import { UserRoles } from './schemas/user.schema';

export interface IUserToken {
    /**
     * The id of the user
     */
    id: string;

    /**
     * The email of the user
     */
    email: string;

    /**
     * The role the user is in
     */
    role: UserRoles;
}
