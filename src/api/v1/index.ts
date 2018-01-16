import express = require('express');
import { authenticationMiddleware } from '../middleware/index';
import accommodationRoutes from './accommodation.routes';
import authenticationRoutes from './authentication.routes';

const router = express.Router();

router.use('/authentication', authenticationRoutes);
router.use('/accommodations', accommodationRoutes);
router.use('/accommodations/:id/approval', accommodationRoutes);

export default router;
