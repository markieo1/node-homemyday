import * as bcrypt from 'bcrypt';
import express = require('express');
import sanitize = require('mongo-sanitize');
import User from '../../model/user.model';
import { expressAsync } from '../../utils/express.async';

const routes = express.Router();

//
// Retourneer een specifieke user. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/authentication/23
//
routes.get('/authentication', (req, res) => {
    res.contentType('application/json');
    const usr = sanitize(req.body.username);
    const pwd = sanitize(req.body.password);

    User.findOne({username: usr}).then((user) => {

        // res.status(200).json(user);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

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
