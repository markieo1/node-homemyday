import * as assert from 'assert';
import 'mocha';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { IUserToken } from '../../src/model/iusertoken.interface';
import { User } from '../../src/model/user.model';
import { AuthenticationService } from '../../src/service/authentication.service';
import { mochaAsync } from '../test.helper';
const app = require('../../src/index').default;

describe('Authentication', () => {

    // Add user
    beforeEach(mochaAsync(async () => {
        const user = new User({
            email: 'test@example.com',
            password: 'Test Password'
        });

        await user.save();
    }));

    it('Tries to register a new user', mochaAsync(async () => {
        const response = await request(app)
            .post('/api/v1/authentication/register')
            .send({
                email: 'test2@example.com',
                password: 'secret'
            })
            .expect(201);
    }));

    it('Tries to register an already existing user', mochaAsync(async () => {
        const response = await request(app)
            .post('/api/v1/authentication/register')
            .send({
                email: 'test@example.com',
                password: 'secret'
            })
            .expect(400);

        const err = response.body;

        assert(err !== null);
        assert(err.errors.length > 0);
    }));

    it('Tries to log in with a correct email and password', mochaAsync(async () => {
        const response = await request(app).post('/api/v1/authentication/login').send({
            email: 'test@example.com',
            password: 'Test Password',
        }).expect(200);

        const body = response.body;

        assert(body !== null);
        assert(body.token);

        const tokenObj: IUserToken = AuthenticationService.decodeToken(body.token) as IUserToken;

        assert(tokenObj.email === 'test@example.com');
    }));

    it('Tries to log in with an incorrect email and password', mochaAsync(async () => {
        const response = await request(app).post('/api/v1/authentication/login').send({
            email: 'test@example.com',
            password: 'this is not a password',
        }).expect(400);

        const body = response.body;

        assert(body !== null);
        assert(body.errors.length > 0);
    }));

    it('Tries to log in without a password', mochaAsync(async () => {
        const response = await request(app).post('/api/v1/authentication/login').send({
            email: 'test@example.com'
        }).expect(400);

        const body = response.body;

        assert(body !== null);
        assert(body.errors.length > 0);
    }));

    it('Returns a 401 if no authorization header is provided', mochaAsync(async () => {
        const response = await request(app)
            .post('/api/v1/accommodations')
            .expect(401);

        const { errors } = response.body;
        assert(errors != null);
        assert(errors.length > 0);
        assert(errors[0] === 'Authorization header not provided');
    }));

    it('Returns a 401 if an invalid token is provided', mochaAsync(async () => {
        const response = await request(app)
            .post('/api/v1/accommodations')
            .set('Authorization', 'Bearer 1232525')
            .expect(401);

        const { errors } = response.body;
        assert(errors != null);
        assert(errors.length > 0);
        assert(errors[0] === 'Token decoding failed');
    }));

    it('Returns a 400 if tried to login with a nonexisting email', mochaAsync(async () => {
        const response = await request(app).post('/api/v1/authentication/login').send({
            email: 'random@random.com',
            password: 'this is not a password',
        }).expect(400);
    }));

    // Remove all users
    afterEach(mochaAsync(async () => {
        await User.remove({});
    }));
});
