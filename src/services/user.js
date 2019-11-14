import UserModel from '../models';
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
    const userData = { id, firstName, lastName, email, createdAt };
    const user = `user:${id}`;
    const credential = `email:${email}`;
    const credentialValue = { id, password };
    await client.multi().hmset(user, userData).sadd('users', id).hmset(credential, credentialValue)
      .execAsync();
    return client.hgetallAsync(user);
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
    const key = `email:${email}`;
    const credential = await client.hgetallAsync(key);
    if (!credential) return null;
    const user = await UserService.fetchById(credential.id);
    return [credential, user];
  }
}

export default UserService;
