import * as express from 'express';
import { AuthenticationError } from '../../errors/index';
import { IUserToken } from '../../model/iusertoken.interface';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { expressAsync } from '../../utils/express.async';
import { ValidationHelper } from '../../utils/validationhelper';

const authenticationMiddleware = expressAsync(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let token: string;
        if (req.headers && req.headers.authorization) {
            // Split the header
            const parts = req.headers.authorization.toString().split(' ');
            if (parts.length === 2) {
                const scheme = parts[0];
                const credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            }
        } else {
            throw new AuthenticationError('Authorization header not provided');
        }

        if (!token) {
            // Error because no token specified
            throw new AuthenticationError('Token not provided');
        }

        // Validate the token
        let parsedToken: IUserToken;
        try {
            parsedToken = AuthenticationService.decodeToken(token) as IUserToken;
        } catch (e) {
            throw new AuthenticationError('Token decoding failed');
        }

        if (!ValidationHelper.isValidMongoId(parsedToken.id)) {
            throw new AuthenticationError('Invalid id provided!');
        }

        // Load the user
        const user = await UserService.getUser(parsedToken.id);

        if (!user) {
            throw new AuthenticationError('User not found!');
        }

        req.authenticatedUser = user;

        next();
    });

export { authenticationMiddleware };
