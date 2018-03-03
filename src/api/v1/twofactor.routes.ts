import express = require('express');
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { IOtpDocument } from '../../model/schemas/otp.schema';
import { TwofactorService } from '../../service/twofactor.service';
import { expressAsync } from '../../utils/express.async';
const routes = express.Router();

routes.get(
  '/setup',
  expressAsync(async (req, res, next) => {
    res.json(req.authenticatedUser.otp);
  })
);

routes.delete(
  '/setup',
  expressAsync(async (req, res, next) => {
    await TwofactorService.disable(req.authenticatedUser);

    res.json({
      success: true
    });
  })
);

routes.post(
  '/setup',
  expressAsync(async (req, res, next) => {
    const setupUser = await TwofactorService.setup(req.authenticatedUser);

    res.json({
      tempSecret: setupUser.otp.tempSecret,
      dataURL: setupUser.otp.dataURL,
      otpURL: setupUser.otp.otpURL
    });
  })
);

routes.post(
  '/verify',
  expressAsync(async (req, res, next) => {
    await TwofactorService.verify(req.authenticatedUser, req.body.token);
    res.json({
      success: true
    });
  })
);

export default routes;
