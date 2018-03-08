import * as jwt from 'jsonwebtoken';
import * as owaspPasswordStrength from 'owasp-password-strength-test';
import * as speakeasy from 'speakeasy';
import { Config } from '../config/config.const';
import { AuthenticationError } from '../errors/index';
import { IUserToken } from '../model/iusertoken.interface';
import { IUserDocument } from '../model/schemas/user.schema';
import { IUserModel, User } from '../model/user.model';

owaspPasswordStrength.config({
  allowPassphrases: true,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4
});

export class AuthenticationService {
  /**
   * Tries to authenticate a user, and return the user object.
   * @param email The email to try and log in with.
   * @param password The password to try and log in with.
   * @param otpToken The otp token
   * @returns An instance of IUserDocument, if the login attempt was successful.
   * @throws An instance of AuthenticationError, if the login attempt was not successful.
   */
  public static async authenticateUser(
    email: string,
    password: string,
    otpToken?: string
  ): Promise<IUserDocument> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid username or password!');
    }

    const result = await user.comparePassword(password);

    if (!result) {
      throw new AuthenticationError('Invalid username or password!');
    }

    if (user.otp && user.otp.enabled) {
      if (!otpToken) {
        throw new AuthenticationError('Missing OTP token!');
      }

      const token = otpToken.replace(/\s/g, '');

      const verified = speakeasy.totp.verify({
        secret: user.otp.secret,
        encoding: 'base32',
        token
      });

      if (!verified) {
        throw new AuthenticationError('Invalid OTP!');
      }
    }

    return user;
  }

  /**
   * Registers a new user.
   * @param email The email of the user.
   * @param password The user's password.
   * @returns An instance of IUserDocument, if the registration attempt was successful.
   * @throws An instance of ValidationError, if there is something wrong with the user data.
   */
  public static async registerUser(
    email: string,
    password: string
  ): Promise<IUserDocument> {
    const testResult = owaspPasswordStrength.test(password);

    if (!testResult.strong) {
      // Password not strong enough
      throw new AuthenticationError('Password not strong enough!');
    }

    const user = new User({
      email,
      password
    });

    return await user.save();
  }

  /**
   * Changes a user's password.
   * @param user The ID of the user to change the password for.
   * @param oldPassword The user's old password, for confirmation.
   * @param newPassword The new desired password.
   */
  public static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);
    const authenticated = await user.comparePassword(oldPassword);

    if (!authenticated) {
      throw new AuthenticationError('Old password is invalid!');
    }

    const testResult = owaspPasswordStrength.test(newPassword);

    if (!testResult.strong) {
      // Password not strong enough
      throw new AuthenticationError('Password not strong enough!');
    }

    user.password = newPassword;

    return await user.save();
  }

  /**
   * Generates a token for a user.
   * @param user The user to generate a token for.
   * @returns A JWT token in string form.
   */
  public static generateToken(user: IUserDocument): string {
    const payload: IUserToken = {
      id: user.id,
      email: user.email,
      role: user.role,
      otpEnabled: Boolean(user.otp && user.otp.enabled)
    };

    const token = jwt.sign(payload, Config.secret, {
      expiresIn: Config.expirationSeconds
    });

    return token;
  }

  /**
   * Decodes a token and returns the object.
   * @param token The token to decode.
   * @returns An object containing the token payload.
   */
  public static decodeToken(token: string): string | object {
    const parsedObject = jwt.verify(token, Config.secret);
    return parsedObject;
  }
}
