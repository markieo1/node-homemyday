import * as bcrypt from 'bcrypt';
import express = require('express');
import expressBrute = require('express-brute');
import { ValidationError } from 'mongoose';
import { ApiError, AuthenticationError } from '../../errors/index';
import { IUserDocument } from '../../model/schemas/user.schema';
import User from '../../model/user.model';
import { AuthenticationService } from '../../service/authentication.service';
import { expressAsync } from '../../utils/express.async';
import { authenticationMiddleware } from '../middleware/authentication.middleware';

const store = new expressBrute.MemoryStore();
const failCallback = (req, res, next, nextValidRequestDate) => {
  req.flash('error', 'You have made too many failed attempts in a short period of time, please try again '
  + 'after: ' + (nextValidRequestDate).fromNow());
  res.redirect('/login'); // brute force protection triggered, send them back to the login page 
};
const bruteforce = new expressBrute(store, {
  freeRetries: 5,
  minWait: 30 * 1000,
  maxWait: 60 * 60 * 1000,
  failCallback: this.failCallback
});

const routes = express.Router();

routes.post(
  '/login',
  bruteforce.prevent,
  expressAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const otpToken = req.body.token;

    if (!email || !password) {
      throw new ApiError(400, 'Invalid email or password!');
    }

    let user: IUserDocument;

    try {
      user = await AuthenticationService.authenticateUser(
        email,
        password,
        otpToken
      );
    } catch (e) {
      if (e instanceof AuthenticationError) {
        throw new ApiError(400, e.message);
      } else {
        throw e;
      }
    }

    const token = AuthenticationService.generateToken(user);

    res.status(200).json({ token });
  })
);

routes.post(
  '/register',
  expressAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      throw new ApiError(400, 'email and password are required!');
    }

    try {
      await AuthenticationService.registerUser(email, password);
    } catch (e) {
      throw new ApiError(400, e ? e.message : null);
    }

    res.status(201).end();
  })
);

routes.post(
  '/changepassword',
  authenticationMiddleware,
  expressAsync(async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!oldPassword || !newPassword) {
      throw new ApiError(400, 'oldPassword and newPassword are required!');
    }

    // Change password
    try {
      await AuthenticationService.changePassword(
        req.authenticatedUser.id,
        oldPassword,
        newPassword
      );
    } catch (e) {
      if (e instanceof AuthenticationError) {
        throw new ApiError(400, e.message);
      } else {
        throw e;
      }
    }

    res.status(204).end();
  })
);

export default routes;
