import { validateProjectSchema, createSchema } from '../validations';
import Helpers from '../utils';
import { User, Project } from '../services';

const { checkRegistered } = User;
const { errorResponse, prepTeamData } = Helpers;
const { fetchById } = Project;

/**
 * A collection of middleware methods used to verify the autheticity
 * of a user's request through the Project route.
 *
 * @class ProjectMiddleware
 */
class ProjectMiddleware {
  /**
     * Validates Project data from the request body.
     * @static
     * @param {object} schema - The schema to be used for validation.
     * @returns {function} - Returns a Middleware function.
     * @memberof ProjectMiddleware
     *
     */
  static validate(schema = createSchema) {
    return (req, res, next) => {
      const message = validateProjectSchema(schema, req.body);
      if (message === true) return next();
      errorResponse(res, {
        code: 400,
        message
      });
    };
  }

  /**
     * Checks that the id of a team member matches an existing user.
     * @static
     * @param {object} req - The request from the endpoint.
     * @param {object} res - The response returned by the method.
     * @param {function} next - Call the next operation.
     * @returns {object} - Returns an object (error or response).
     * @memberof ProjectMiddleware
     *
     */
  static async verifyTeam(req, res, next) {
    try {
      const team = prepTeamData(req.body);
      if (!team.length) {
        req.team = team;
        return next();
      }
      const [isRegistered, teamMembers] = await checkRegistered(team);
      if (isRegistered) {
        req.team = teamMembers.map(member => {
          const [, user] = member;
          return user.id;
        });
        return next();
      }
      const message = team.length > 1 ? 'The user you intend to add to your team is not registered'
        : 'One or more of the users you intend to add is not registered';
      errorResponse(res, {
        code: 400,
        message
      });
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Checks that a project with the ID exists.
   * @static
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof ProjectMiddleware
   *
   */
  static async isProjectExist(req, res, next) {
    const { projectId } = req.params;
    try {
      const project = await fetchById(projectId);
      if (!project) {
        return errorResponse(res, {
          code: 404,
          message: 'A project with the given ID does not exist'
        });
      }
      req.project = project;
      next();
    } catch (e) {
      errorResponse(res, {});
    }
  }

  /**
   * Checks if a project was created by a certain user.
   * @static
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof ProjectMiddleware
   *
   */
  static isProjectOwner(req, res, next) {
    const {
      data: { id },
      project: { owner }
    } = req;
    if (id === owner.id) return next();
    errorResponse(res, {
      code: 403,
      message: 'Only the project owner is authorized to perform this action'
    });
  }

  /**
   * Checks if a user to be added is already a member of the team.
   * @static
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof ProjectMiddleware
   *
   */
  static isMemberAlready(req, res, next) {
    const {
      project: { team: projectTeam },
      team
    } = req;
    const isExistingMember = projectTeam.some(({ id }) => team.includes(id));
    if (!isExistingMember) return next();
    const message = team.length > 1 ? 'The user to be added is already on the team'
      : 'One or more of the users to be added is already on the team';
    errorResponse(res, {
      code: 400,
      message
    });
  }

  /**
   * Verifies that the user is a member of the team working on
   * a specific project he/she intends to modify.
   * @static
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof ProjectMiddleware
   *
   */
  static isProjectTeamMember(req, res, next) {
    const {
      data: { id },
      project: { team }
    } = req;
    const member = team.find(teamMember => teamMember.id === id);
    if (member) return next();
    errorResponse(res, {
      code: 403,
      message:
        'You are not authorized to modify a project if you are not a team member'
    });
  }

  /**
   * Verifies that the user is a member of the team working on a specific project.
   * @static
   * @param {object} req - The request from the endpoint.
   * @param {object} res - The response returned by the method.
   * @param {function} next - Call the next operation.
   *@returns {object} - Returns an object (error or response).
   * @memberof ProjectMiddleware
   *
   */
  static verifyMember(req, res, next) {
    const {
      params: { memberId },
      project: { team }
    } = req;
    const member = team.find(teamMember => teamMember.id === memberId);
    if (member) return next();
    errorResponse(res, {
      code: 400,
      message:
        'The user with the ID provided is not a member of the team on this project'
    });
  }
}

export default ProjectMiddleware;
