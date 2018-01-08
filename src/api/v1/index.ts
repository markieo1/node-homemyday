import express = require('express');

import accommodationRoutes from './accommodation.routes';

const router = express.Router();

router.use('/accommodations', accommodationRoutes);

export default router;
