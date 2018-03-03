import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { AuthenticationError } from '../errors/authentication.error';
import { IOtpDocument } from '../model/schemas/otp.schema';
import { IUserDocument } from '../model/schemas/user.schema';

export class TwofactorService {
  /**
   * Setups the twofactor for the user
   * @param user The user to setup two factor for
   */
  public static async setup(user: IUserDocument) {
    const secret = speakeasy.generateSecret({ length: 10, name: 'HomeMyDay' });
    const dataUrl = await QRCode.toDataURL(secret.otpauth_url);

    user.otp = {
      secret: '',
      tempSecret: secret.base32,
      dataURL: dataUrl,
      otpURL: secret.otpauth_url
    } as IOtpDocument;

    await user.save();

    return user;
  }

  /**
   * Verifies the user token
   * @param user The user with twofactor
   * @param token The token supplied by the user
   */
  public static async verify(user: IUserDocument, token: string) {
    const verified = speakeasy.totp.verify({
      secret: user.otp.tempSecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      user.otp.secret = user.otp.tempSecret;
      user.otp.enabled = true;

      await user.save();
    } else {
      throw new AuthenticationError('Invalid OTP!');
    }
  }

  /**
   * Disables two factor authentication
   * @param user The user to disable two factor for
   */
  public static async disable(user: IUserDocument) {
    await user.otp.remove();

    await user.save();
  }
}
