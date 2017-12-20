import { IConfig } from './config.interface';

const config: IConfig = require('../../config/config');

export const Config: IConfig = {
    allowOrigin: process.env.ALLOW_ORIGIN || config.allowOrigin,
    mongoDbUri: process.env.MONGODB_URI || config.mongoDbUri,
    port: (process.env.PORT || config.port) as number
};
