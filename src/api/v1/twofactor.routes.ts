import express = require('express');
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { IOtpDocument } from '../../model/schemas/otp.schema';
import { TwofactorService } from '../../service/twofactor.service';
import { expressAsync } from '../../utils/express.async';
import { LoggingService } from '../../service/logging.service';

const logger = new LoggingService();
const routes = express.Router();

routes.get(
  '/setup',
  expressAsync(async (req, res, next) => {
    try {
      res.json(req.authenticatedUser.otp);
    } catch (error) {
      logger.Log(error);
    }
  })
);

routes.delete(
  '/setup',
  expressAsync(async (req, res, next) => {
    try {
      await TwofactorService.disable(req.authenticatedUser);

      res.json({
        success: true
      });
    } catch (error) {
      logger.Log(error);
    }
  })
);

routes.post(
  '/setup',
  expressAsync(async (req, res, next) => {
    try {
      const setupUser = await TwofactorService.setup(req.authenticatedUser);

      res.json({
        tempSecret: setupUser.otp.tempSecret,
        dataURL: setupUser.otp.dataURL,
        otpURL: setupUser.otp.otpURL
      });
    } catch (error) {
      logger.Log(error);
    }
  })
);

routes.post(
  '/verify',
  expressAsync(async (req, res, next) => {
    try {
      await TwofactorService.verify(req.authenticatedUser, req.body.token);
      res.json({
        success: true
      });
    } catch (error) {
      logger.Log(error);
    }
  })
);

export default routes;
