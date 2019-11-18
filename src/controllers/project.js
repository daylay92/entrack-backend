import uuidv4 from 'uuid/v4';
import { Project } from '../services';
import Helpers from '../utils';

const { errorResponse, successResponse } = Helpers;
const { fetchByOwnerId, addToTeam, removeFromTeam, updateById, deleteById } = Project;

/**
 * A collection of methods that controls the response
 * of CRUD operations on a Project Instance.
 *
 * @class ProjectController
 */
class ProjectController {
  /**
    * Creates a new project.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response containing the details of the project.
    * @memberof ProjectController
    */
  static async create(req, res) {
    try {
      const { body, data, team } = req;
      const id = uuidv4();
      const project = new Project({ id, ...body, team, ownerId: data.id });
      await project.save();
      successResponse(res, project, 201);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Fetches all user's project.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response.
    * @memberof ProjectController
    */
  static async getProjects(req, res) {
    try {
      const { id } = req.data;
      const projects = await fetchByOwnerId(id);
      successResponse(res, projects, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Fetches a project by its Id.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response containing the details of the project.
    * @memberof ProjectController
    */
  static async getProject(req, res) {
    try {
      const { project } = req;
      successResponse(res, project, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Updates a project details.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response containing the details of the updated project.
    * @memberof ProjectController
    */
  static async modifyProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await updateById(projectId, req.body);
      successResponse(res, project, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Deletes a project.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response with an empty body.
    * @memberof ProjectController
    */
  static async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      await deleteById(projectId);
      successResponse(res, {}, 204);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Adds to a project's team members.
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response containing the details of the project.
    * @memberof QuestionController
    */
  static async addMembersToTeam(req, res) {
    try {
      const { team, params: { projectId } } = req;
      const project = await addToTeam(projectId, team);
      successResponse(res, project, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
    * Removes a user from a project's team
    *
    * @static
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @returns { JSON } A JSON response containing the details of the question.
    * @memberof QuestionController
    */
  static async removeMemberFromTeam(req, res) {
    try {
      const { memberId, projectId } = req.params;
      const project = await removeFromTeam(projectId, memberId);
      successResponse(res, project, 200);
    } catch (e) {
      errorResponse(res, {});
    }
  }
}

export default ProjectController;
