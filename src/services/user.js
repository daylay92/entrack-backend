import { User as UserModel } from '../models';
import client from '../database';

/**
 * It is the interface of user model.
 *
 * @class UserService
 */
class UserService extends UserModel {
  /**
 * It is creates an Instance of a user.
 * @returns {Promise<object>} A promise object of the new user Instance.
 * @memberof UserService
 */
  async save() {
    const { id, email, password, lastName, firstName, createdAt } = this;
    const userData = { id, firstName, lastName, email: email.toLowerCase(), createdAt };
    const user = `user:${id}`;
    const credential = `email:${email.toLowerCase()}`;
    const credentialValue = { id, password };
    try {
      await client.multi().hmset(user, userData).sadd('users', id).hmset(credential, credentialValue)
        .execAsync();
      return client.hgetallAsync(user);
    } catch (e) {
      throw Error(e.message || 'Failed to create User');
    }
  }

  /**
   * Finds a user by his/her ID
   * @param {string} id - User's ID
   * @returns {Promise<object>} A promise object with user object.
   * @memberof UserService
   */
  static async fetchById(id) {
    const key = `user:${id}`;
    return client.hgetallAsync(key);
  }

  /**
   * Finds a user by his/her email
   * @param {string} email - User's email address
   * @returns {Promise<object> | null } A promise object with user detail
   * or null if email doesn't exist.
   * @memberof UserService
   */
  static async fetchByEmail(email) {
    const key = `email:${email.toLowerCase()}`;
    try {
      const credential = await client.hgetallAsync(key);
      if (!credential) return null;
      const user = await UserService.fetchById(credential.id);
      return [credential, user];
    } catch (e) {
      throw Error('Failed to fetch User by Email');
    }
  }

  /**
   * Check if an array of an email addresses belongs to registered users.
   * @param {array} addresses - User's email address
   * @returns {Promise<array> } A promise object with a two part array,
   * containing the boolean result of the check and the team array
   * @memberof UserService
   */
  static async checkRegistered(addresses) {
    let isRegistered = false;
    const members = addresses.map(async memberEmail => UserService.fetchByEmail(memberEmail));
    try {
      const teamMembers = await Promise.all(members);
      isRegistered = teamMembers.some(member => member === null);
      return [!isRegistered, teamMembers];
    } catch (e) {
      throw Error(e.message || 'Failed to confirm registration status of users');
    }
  }
}

export default UserService;
