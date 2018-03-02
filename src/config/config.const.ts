import { IConfig } from './config.interface';

const config: IConfig = require('../../config/config');

export const Config: IConfig = {
    allowOrigin: process.env.ALLOW_ORIGIN || config.allowOrigin,
    mongoDbUri: process.env.MONGODB_URI || config.mongoDbUri,
    port: (process.env.PORT || config.port) as number,
    httpsPort: (process.env.HTTPS_PORT || config.httpsPort) as number,
    secret: process.env.JWT_KEY || config.secret,
    expirationSeconds: (process.env.JWT_EXPIRATION_SECONDS || config.expirationSeconds) as number,
    imagePath: process.env.IMAGE_PATH || config.imagePath,
    sslPfxPath: process.env.SSL_PFX_PATH || config.sslPfxPath,
    sslPfxPassword: process.env.SSL_PFX_PASSWORD || config.sslPfxPassword,
    clientCertPath: process.env.CLIENT_CERT_PATH || config.clientCertPath
};
