import * as assert from 'assert';
import 'mocha';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { Accommodation } from '../../src/model/accommodation.model';
import { IAccommodationDocument } from '../../src/model/schemas/accommodation.schema';
import { User } from '../../src/model/user.model';
import { AccommodationService } from '../../src/service/accommodation.service';
import { mochaAsync } from '../test.helper';
const app = require('../../src/index').default;

describe('Accommodation', () => {
    let userToken: string;
    let createdUserId: string;

    before(mochaAsync(async () => {
        const user = new User({
            email: 'test@test.com',
            password: 'Test Password'
        });

        await user.save();

        createdUserId = user.id;

        const response = await request(app).post('/api/v1/authentication/login').send({
            email: 'test@test.com',
            password: 'Test Password',
        }).expect(200);

        const { token } = response.body;

        userToken = token;
    }));

    describe('Create Read Update Delete', () => {

        let accommodationId;

        beforeEach(mochaAsync(async () => {
            // Create accomodation
            const accommodation = new Accommodation({
                name: 'Test Accommodation',
                maxPersons: 4,
                price: '350',
                userId: createdUserId
            });

            await accommodation.save();

            accommodationId = accommodation._id;
        }));

        it('Can\'t make an request to the Accommodations without being authenticated', mochaAsync(async () => {
            const response = await request(app)
                .post('/api/v1/accommodations')
                .expect(401);
        }));

        it('Can get all accommodations', mochaAsync(async () => {
            const response = await request(app)
                .get('/api/v1/accommodations')
                .expect(200);

            const accommodations = response.body;

            assert(accommodations !== null);
            assert(accommodations.length > 0);
            assert(accommodations[0].name === 'Test Accommodation');
        }));

        it('Can get an accommodation by id', mochaAsync(async () => {
            const response = await request(app)
                .get('/api/v1/accommodations/' + accommodationId)
                .expect(200);

            const accommodation = response.body;

            assert(accommodation !== null);
            assert(accommodation.name === 'Test Accommodation');
        }));

        it('Tries to fetch an accommodation by an invalid ID', mochaAsync(async () => {
            const response = await request(app)
                .get('/api/v1/accommodations/jklsiop')
                .expect(400);

            const err = response.body;

            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can delete an accommodation by id', mochaAsync(async () => {
            const response = await request(app)
                .delete('/api/v1/accommodations/' + accommodationId)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204);

            assert(response !== null);
        }));

        it('Can not delete accommodation by an already deleted id', mochaAsync(async () => {
            await request(app)
                .delete('/api/v1/accommodations/' + accommodationId)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(204);

            const response = await request(app)
                .delete('/api/v1/accommodations/' + accommodationId)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);

            assert(response !== null);

            const err = response.body;
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can not delete an accommodation by invalid format id', mochaAsync(async () => {
            const response = await request(app)
                .delete('/api/v1/accommodations/abcdefghjiklmnopqrstuvwxyz')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(400);

            assert(response !== null);

            const err = response.body;
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can update an accommodation', mochaAsync(async () => {

            const accommodation = await AccommodationService.getAccommodation(accommodationId);
            accommodation.name = 'Update Accommodation Test';

            const response = await request(app)
                .put('/api/v1/accommodations/' + accommodationId)
                .set('Authorization', `Bearer ${userToken}`)
                .send(accommodation)
                .expect(200);

            const newAccommodation = response.body;

            assert(newAccommodation !== null);
            assert(newAccommodation.name === 'Update Accommodation Test');
        }));

        it('Tries to update an accommodation by an invalid ID', mochaAsync(async () => {
            const response = await request(app)
                .put('/api/v1/accommodations/jklsiop')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Invalid' })
                .expect(400);

            const err = response.body;

            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Tries to update an accommodation with invalid values', mochaAsync(async () => {
            let accommodation = await AccommodationService.getAccommodation(accommodationId) as any;
            // Convert to plain object and give it an invalid value
            accommodation = accommodation.toObject();
            accommodation.maxPersons = 'A million!!';

            const response = await request(app)
                .put('/api/v1/accommodations/' + accommodationId)
                .set('Authorization', `Bearer ${userToken}`)
                .send(accommodation)
                .expect(400);

            const err = response.body;

            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can create new accommodation', mochaAsync(async () => {
            const count = await Accommodation.count({});
            const response = await request(app)
                .post('/api/v1/accommodations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'TestName',
                    maxPersons: 2,
                    price: '200'
                })
                .expect(201);

            const { name, maxPersons, price } = response.body;
            const newCount = await Accommodation.count({});

            assert(count + 1 === newCount);
            assert(name === 'TestName');
            assert(maxPersons === 2);
            assert(price === '200');
        }));

        it('Tries to create new accomodations without some required props', mochaAsync(async () => {
            const count = await Accommodation.count({});
            const response = await request(app)
                .post('/api/v1/accommodations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    maxPersons: 2,
                    price: '200'
                })
                .expect(400);

            const err = response.body;
            const newCount = await Accommodation.count({});

            assert(count === newCount);
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Tries to create new accomodations with invalid props type', mochaAsync(async () => {
            const count = await Accommodation.count({});
            const response = await request(app)
                .post('/api/v1/accommodations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'TestName',
                    maxPersons: 'Test',
                    price: '200'
                })
                .expect(400);

            const err = response.body;
            const newCount = await Accommodation.count({});

            assert(count === newCount);
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can create an accommodation and add the current authenticated user id to it', mochaAsync(async () => {
            const count = await Accommodation.count({});
            const response = await request(app)
                .post('/api/v1/accommodations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'TestName',
                    maxPersons: 2,
                    price: '200'
                })
                .expect(201);

            const { name, maxPersons, price, userId } = response.body;
            const newCount = await Accommodation.count({});

            assert(count + 1 === newCount);
            assert(name === 'TestName');
            assert(maxPersons === 2);
            assert(price === '200');
            assert(createdUserId === userId);
        }));

        it('Can get all accommodations created by the current logged in user', mochaAsync(async () => {
            // Create accomodation
            await new Accommodation({
                name: 'Test Accommodation 1',
                maxPersons: 4,
                price: '350',
                userId: createdUserId
            }).save();

            await new Accommodation({
                name: 'Test Accommodation 2',
                maxPersons: 4,
                price: '35000',
                userId: createdUserId
            }).save();

            // This accommodation has another id
            await new Accommodation({
                name: 'Test Accommodation 3',
                maxPersons: 2,
                price: '3150',
                userId: '5a55e64a6bcbbb0d306f1cf0'
            }).save();

            const count = await Accommodation.count({
                userId: createdUserId
            });

            const response = await request(app)
                .get('/api/v1/accommodations/me')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            const body = response.body;

            assert(body instanceof Array);

            const array = body as any[];
            assert(array.length === count);

            assert(array.every((x) => x.userId === createdUserId));
        }));

        afterEach(mochaAsync(async () => {
            await Accommodation.remove({});
        }));
    });

    after(mochaAsync(async () => {
        await User.remove({});
    }));
});
