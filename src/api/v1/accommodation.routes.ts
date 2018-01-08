import express = require('express');

import { Accommodation } from '../../model/accommodation.model';
import { IAccommodationDocument } from '../../model/schemas/accommodation.schema';
import { expressAsync } from '../../utils/express.async';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {
    const accommodations = await Accommodation.find({});

    res.send(accommodations);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {
    const accommodation = await Accommodation.findById(req.params.id);

    res.send(accommodation);
}));

routes.post('/', expressAsync(async (req, res, next) => {
    const reqBody = req.body;

    const newAccomodation = {

    } as IAccommodationDocument;

    const accommodation = await Accommodation.create();
    res.send();
}));

export default routes;
