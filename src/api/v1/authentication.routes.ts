import * as bcrypt from 'bcrypt';
import express = require('express');
import User from '../../model/user.model';
import { expressAsync } from '../../utils/express.async';

const routes = express.Router();

routes.post('/register', expressAsync(async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username,
        password
    });

    await user.save();

    res.status(204).end();
}));

export default routes;
