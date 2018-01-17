import express = require('express');
import { Config } from '../../config/config.const';

const routes = express.Router();

routes.use('/', express.static(Config.imagePath));

export default routes;
