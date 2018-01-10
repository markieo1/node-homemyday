import * as express from 'express';
import { UserService } from '../../service/user.service';
import { expressAsync } from '../../utils/express.async';

const paginateMiddleware = expressAsync(
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
        }

        if (!token) {
            // Error because no token specified
        }

        // Validate the token

        // Load the user
        const user = await UserService.getUser('');
        req.authenticatedUser = user;
        next();
    });

export default paginateMiddleware;
