import * as bcrypt from 'bcrypt';
import express = require('express');
import { ValidationError } from 'mongoose';
import User from '../../model/user.model';
import { expressAsync } from '../../utils/express.async';
import { ApiError } from '../errors/api.error';

const routes = express.Router();

routes.post('/register', expressAsync(async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const user = new User({
        email,
        password
    });

    try {
        await user.save();
    } catch (e) {
        if (e.name === 'ValidationError') {
            throw new ApiError(400, e.message);
        } else {
            throw e;
        }
    }

    res.status(201).end();
}));

export default routes;
