import express = require('express');
import * as mongoose from 'mongoose';

import { Accommodation } from '../../model/accommodation.model';
import { AccommodationService } from '../../service/accommodation.service';
import { expressAsync } from '../../utils/express.async';
import { ValidationHelper } from '../../utils/validationhelper';
import { ApiError } from '../errors/index';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {
    const accommodations = await AccommodationService.getAccommodations();

    res.json(accommodations);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {

    if (!ValidationHelper.isValidMongoId(req.params.id)) {
        throw new ApiError(400, 'Invalid ID!');
    }

    const accommodation = await AccommodationService.getAccommodation(req.params.id);

    res.json(accommodation);
}));

routes.delete('/:id', expressAsync(async (req, res, next) => {
    const accommodationId = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(accommodationId);
    if (!isValidId) {
        throw new ApiError(400, 'Invalid id supplied!');
    }

    await AccommodationService.deleteAccommodation(accommodationId);
    res.sendStatus(204);
}));

export default routes;
