import express = require('express');
import routesAuthentication from './authentication.routes';
const router = express.Router();

router.use('/authentication', routesAuthentication);

export default router;
