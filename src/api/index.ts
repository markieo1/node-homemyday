import express = require('express');
import { Config } from '../config/config.const';
import routesV1 from './v1';

const router = express.Router();

router.use('/v1', routesV1);
router.use('/v1/images', express.static(Config.imagePath));

export = router;
