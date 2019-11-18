import { User, Project } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse } = Helpers;
const { fetchProjectsByUserId } = Project;
const { fetchById } = User;

/**
 * A collection of methods that controls and issues
 * the final response for CRUD operation on a User Instance.
 *
 * @class UserController
 */
class UserController {
  /**
     * Fetches a new user.
     *
     * @static
     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @returns { JSON } A JSON response with the registered user's details.
     * @memberof Auth
     */
  static async fetch(req, res) {
    try {
      const { id } = req.params;
      const user = fetchById(id);
      successResponse(res, user, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Fetches all the projects with which a user belongs on a team.
   *
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @returns { JSON } A JSON response with an array of projects.
   * @memberof Auth
   */
  static async fetchTeamProjects(req, res) {
    try {
      const { id } = req.data;
      const projects = await fetchProjectsByUserId(id);
      successResponse(res, projects, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default UserController;
