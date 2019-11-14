import Helpers from '../utils';

const { hashPassword } = Helpers;

/**
 * It is the User model.
 *
 * @class User
 */
export default class User {
  /**
    * User model constructor for creating a new Instance of a User.
    * @param {number | object | string} options - An object that contains
    *  the properties of a user.
    * @param {number} options.id - A unique user ID.
    * @param {number} options.firstName - User's first name.
    * @param {number} options.lastName - User's last name.
    * @param {number} options.email - User's email address.
    * @param {number} options.password - User's password.
    * @memberof User
  */
  constructor(options) {
    this.id = options.id;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.email = options.email;
    this.password = hashPassword(options.password);
    this.createdAt = new Date().toLocaleString();
  }
}
