import uuidv4 from 'uuid/v4';
import User from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse, addTokenToRes, comparePassword } = Helpers;

/**
 * A collection of methods that controls and issues the final response during authetication.
 *
 * @class AuthController
 */
class AuthController {
  /**
   * Registers a new user.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the registered user's details and a JWT.
   * @memberof Auth
   */
  static async signup(req, res) {
    try {
      const id = uuidv4();
      const user = new User({ id, ...req.body });
      const data = await user.save();
      const userData = addTokenToRes(data);
      res.cookie('token', userData.token, {
        maxAge: 7200000,
        httpOnly: true,
        sameSite: true
      });
      return successResponse(res, userData, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Logs in a user.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with the user's details and a JWT.
   * @memberof Auth
   */
  static async signin(req, res) {
    try {
      const { user: userArr, body } = req;
      const [credential, userDetails] = userArr;
      const isAuthenticUser = comparePassword(body.password, credential.password);
      if (!isAuthenticUser) {
        return errorResponse(res, {
          code: 401,
          message: 'Invalid email/password'
        });
      }
      const userData = addTokenToRes(userDetails);
      res.cookie('token', userData.token, {
        maxAge: 7200000,
        httpOnly: true,
        sameSite: true
      });
      successResponse(res, userData, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   *  Logs out an autheticated user.
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } - A JSON object containing success or failure details.
   * @memberof Auth
   */
  static logout(req, res) {
    res.clearCookie('token', { httpOnly: true, sameSite: true });
    const data = { message: 'You have been successfully logged out' };
    successResponse(res, data, 200);
  }
}

export default AuthController;
