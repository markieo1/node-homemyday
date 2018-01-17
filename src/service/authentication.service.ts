import * as jwt from 'jsonwebtoken';
import { Config } from '../config/config.const';
import { AuthenticationError } from '../errors/index';
import { IUserToken } from '../model/iusertoken.interface';
import { IUserDocument } from '../model/schemas/user.schema';
import { IUserModel, User } from '../model/user.model';

export class AuthenticationService {

    /**
     * Tries to authenticate a user, and return the user object.
     * @param email The email to try and log in with.
     * @param password The password to try and log in with.
     * @returns An instance of IUserDocument, if the login attempt was successful.
     * @throws An instance of AuthenticationError, if the login attempt was not successful.
     */
    public static async authenticateUser(email: string, password: string): Promise<IUserDocument> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError('Invalid username or password!');
        }

        const result = await user.comparePassword(password);

        if (!result) {
            throw new AuthenticationError('Invalid username or password!');
        }

        return user;
    }

    /**
     * Generates a token for a user.
     * @param user The user to generate a token for.
     * @returns A JWT token in string form.
     */
    public static generateToken(user: IUserDocument): string {
        const payload: IUserToken = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, Config.secret, {
            expiresIn: Config.expirationSeconds
        });

        return token;
    }

    /**
     * Decodes a token and returns the object.
     * @param token The token to decode.
     * @returns An object containing the token payload.
     */
    public static decodeToken(token: string): string | object {
        const parsedObject = jwt.verify(token, Config.secret);
        return parsedObject;
    }
}
