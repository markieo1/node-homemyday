import express = require('express');
import routesAuthentication from './authentication.routes';
import accommodationRoutes from './accommodation.routes';

const router = express.Router();

router.use('/authentication', routesAuthentication);
router.use('/accommodations', accommodationRoutes);

export default router;
