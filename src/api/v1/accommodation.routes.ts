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
        name: reqBody.name,
        description: reqBody.description,
        maxPersons: reqBody.maxPersons,
        continent: reqBody.continent,
        country: reqBody.country,
        location: reqBody.location,
        latitude: reqBody.latitude,
        longitude: reqBody.longitude,
        rooms: reqBody.rooms,
        beds: reqBody.beds,
        recommended: reqBody.recommended,
        price: reqBody.price,
        spaceText: reqBody.spaceText,
        servicesText: reqBody.servicesText,
        pricesText: reqBody.pricesText,
        rulesText: reqBody.rulesText,
        cancellationText: reqBody.cancellationText
    } as IAccommodationDocument;

    const accommodation = await Accommodation.create(newAccomodation);

    res.status(201).send(accommodation);
}));

export default routes;
