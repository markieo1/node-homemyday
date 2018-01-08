import express = require('express');
import * as mongoose from 'mongoose';
import { Accommodation } from '../../model/accommodation.model';
import { expressAsync } from '../../utils/express.async';
import { ApiError } from '../errors/api.error';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {
    const accommodations = await Accommodation.find({});

    res.send(accommodations);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {
    const accommodation = await Accommodation.findById(req.params.id);

    res.send(accommodation);
}));

routes.delete('/:id', expressAsync(async (req, res, next) => {
    const accommodationId = req.params.id;

    const isValidId = mongoose.Types.ObjectId.isValid(accommodationId);
    if (!isValidId) {
        throw new ApiError(400, 'Invalid id supplied!');
    }

    await Accommodation.remove({ _id: accommodationId });

    res.send(204).send();
}));

export default routes;
