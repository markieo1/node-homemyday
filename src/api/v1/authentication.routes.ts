import express = require('express');
import sanitize = require('mongo-sanitize');
import * as bcrypt from 'bcrypt';
import User from '../../model/user.model';

const router = express.Router();

//
// Retourneer een specifieke user. Hier maken we gebruik van URL parameters.
// Vorm van de URL: http://hostname:3000/api/v1/authentication/23
//
router.get('/authentication', function (req, res) {
    res.contentType('application/json');
    const usr = sanitize(req.body.username);
    const pwd = sanitize(req.body.password);

    

    User.findOne({username: usr}).then((user) => {

        //res.status(200).json(user);
    }).catch((error) => {
        res.status(400).json(error);
    });
});

export default router;