import express = require('express');
import * as mongoose from 'mongoose';

import { Accommodation } from '../../model/accommodation.model';
import { AccommodationService } from '../../service/accommodation.service';
import { expressAsync } from '../../utils/express.async';
import { ApiError } from '../errors/api.error';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {
    const accommodations = await AccommodationService.getAccommodations();

    res.json(accommodations);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {
    const accommodation = await AccommodationService.getAccommodation(req.params.id);

    res.json(accommodation);
}));

routes.delete('/:id', expressAsync(async (req, res, next) => {
    await AccommodationService.deleteAccommodation(req.params.id)
        .then(() => {
            res.send(204).send();
        })
        .catch((error) => {
            throw new ApiError(400, `Error occured while removing accommodation with id: ${req.params.id}`);
        });
}));

export default routes;
