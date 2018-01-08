import express = require('express');

import { Accommodation } from '../../model/accommodation.model';
import { AccommodationService } from '../../service/accommodation.service';
import { expressAsync } from '../../utils/express.async';

const routes = express.Router();

routes.get('/', expressAsync(async (req, res, next) => {
    const accommodations = await AccommodationService.getAccommodations();

    res.json(accommodations);
}));

routes.get('/:id', expressAsync(async (req, res, next) => {
    const accommodation = await AccommodationService.getAccommodation(req.params.id);

    res.json(accommodation);
}));

export default routes;
