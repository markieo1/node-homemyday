import * as express from 'express';
import { AuthenticationError } from '../../errors/index';
import { IUserToken } from '../../model/iusertoken.interface';
import { UserRoles } from '../../model/schemas/user.schema';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService } from '../../service/user.service';
import { expressAsync } from '../../utils/express.async';
import { ValidationHelper } from '../../utils/validationhelper';

const adminMiddleware = expressAsync(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const user = req.authenticatedUser;

        if (!user) {
            throw new Error('Authentication middleware not called yet!');
        }

        // Check if the user has the correct role.
        if (user.role !== UserRoles.Administrator) {
            throw new AuthenticationError('Admin rights required!');
        }

        next();
    });

export { adminMiddleware };
