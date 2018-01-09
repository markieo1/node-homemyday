import * as assert from 'assert';
import 'mocha';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { Accommodation } from '../../src/model/accommodation.model';
import { mochaAsync } from '../test.helper';
const app = require('../../src/index').default;

describe('Accommodation', () => {
    describe('Create Read Update Delete', () => {

        let accommodationId;

        beforeEach(mochaAsync(async () => {
            // Create user
            const accommodation = new Accommodation({
                name: 'Test Accommodation',
                maxPersons: 4,
                price: '350'
            });

            await accommodation.save();

            accommodationId = accommodation._id;
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
                .expect(204);

            assert(response !== null);
        }));

        it('Can not delete an accommodation by invalid id', mochaAsync(async () => {
            await request(app)
                .delete('/api/v1/accommodations/' + accommodationId)
                .expect(204);

            const response = await request(app)
                .delete('/api/v1/accommodations/' + accommodationId)
                .expect(400);

            assert(response !== null);

            const err = response.body;
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        it('Can not delete an accommodation by invalid format id', mochaAsync(async () => {
            const response = await request(app)
                .delete('/api/v1/accommodations/abcdefghjiklmnopqrstuvwxyz')
                .expect(400);

            assert(response !== null);

            const err = response.body;
            assert(err !== null);
            assert(err.errors.length > 0);
        }));

        afterEach(mochaAsync(async () => {
            await Accommodation.remove({});
        }));
    });
});
