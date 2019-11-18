import { Project as ProjectModel } from '../models';
import User from './user';
import client from '../database';
import Helpers from '../utils';

const { fetchById: findUserById } = User;
const { prepForUpdate } = Helpers;

/**
 * It is the interface of user model.
 *
 * @class ProjectService
 */
class ProjectService extends ProjectModel {
  /**
   * It is creates an Instance of a project.
   * @returns {Promise<object>} A promise object of the new project Instance.
   * @memberof ProjectService
   */
  async save() {
    const { id, owner, title, description, team, createdAt, updatedAt } = this;
    const project = { id, title, description, owner, createdAt, updatedAt };
    const projectKey = `project:${id}`;
    const projectTeamKey = `project:${id}:team`;
    const userProjectsKey = `user:${owner}:projects`;
    await client
      .multi()
      .hmset(projectKey, project)
      .sadd(projectTeamKey, owner, ...team)
      .sadd('projects', id)
      .sadd(userProjectsKey, id)
      .execAsync();
    this.team.push(owner);
    const memberArr = this.team.map(async member => findUserById(member));
    this.team = await Promise.all(memberArr);
    const projectOwner = await findUserById(owner);
    this.owner = projectOwner;
  }

  /**
   * Finds a project by its ID
   * @static
   * @param {string} id - Project's ID
   * @returns {Promise<object>} A promise object with the project properties.
   * @memberof ProjectService
   */
  static async fetchById(id) {
    const projectKey = `project:${id}`;
    try {
      const project = await client.hgetallAsync(projectKey);
      if (!project) return null;
      const projectTeamKey = `project:${id}:team`;
      const members = await client.smembersAsync(projectTeamKey);
      let team = [];
      if (members.length) {
        const memberArr = members.map(async member => findUserById(member));
        team = await Promise.all(memberArr);
      }
      const projectStoriesKey = `project:${id}:stories`;
      const storiesArr = await client.smembersAsync(projectStoriesKey);
      let stories = storiesArr;
      if (storiesArr.length) {
        // do something like pull all stories
        stories = [];
      }
      const owner = await findUserById(project.owner);
      return {
        ...project,
        owner,
        team,
        stories
      };
    } catch (e) {
      const msg = e.message || 'An Error occurred while fetching projects';
      throw new Error(msg);
    }
  }

  /**
   * Fetch a list of project by their owner's ID
   * @static
   * @param {string} id - Owner's ID.
   * @returns {Promise<array>} A promise that resolves to an array of projects.
   * @memberof ProjectService
   */
  static async fetchByOwnerId(id) {
    const userProjectsKey = `user:${id}:projects`;
    try {
      const projects = await client.smembersAsync(userProjectsKey);
      let res = [];
      if (projects.length) {
        res = projects.map(async projectId => ProjectService.fetchById(projectId));
      }
      return Promise.all(res);
    } catch (e) {
      throw new Error(e.message || 'something went wrong while fetching owner projects');
    }
  }

  /**
   * Fetch a list of project for which a user belongs on its team
   * @static
   * @param {string} id - User ID.
   * @returns {Promise<array>} A promise that resolves to an array of projects.
   * @memberof ProjectService
   */
  static async fetchProjectsByUserId(id) {
    try {
      const projects = await client.smembersAsync('projects');
      if (!projects.length) return [];
      const projectsData = projects.map(async projectId => ProjectService.fetchById(projectId));
      const result = await Promise.all(projectsData);
      return result.filter(project => {
        if (project) {
          const { team } = project;
          const teamIds = team.map(teamObj => teamObj.id);
          return teamIds.includes(id);
        }
        return false;
      });
    } catch (e) {
      throw Error(e.message || 'Failed to fetch projects');
    }
  }

  /**
   * Updates a project by its ID
   * @static
   * @param {string} id - Project ID.
   * @param {array} body - An array of keys and values that represents the fields to be updated.
   * @returns {Promise<object> | null } A promise object with the updated instance properties.
   * @memberof ProjectService
   */
  static async updateById(id, body) {
    const key = `project:${id}`;
    const keyValues = prepForUpdate(body);
    await client.hmset(key, ...keyValues);
    return ProjectService.fetchById(id);
  }

  /**
   * Updates a project by its ID
   * @static
   * @param {string} id - Project ID.
   * @param {string} authorId - Owner's ID.
   * @returns {Promise<object> | null } A promise object with the updated instance properties.
   * @memberof ProjectService
   */
  static async deleteById(id, authorId) {
    const projectKey = `project:${id}`;
    const projectTeamKey = `project:${id}:team`;
    const projectStoriesKey = `project:${id}:stories`;
    const userProjectsKey = `user:${authorId}:projects`;
    await client
      .multi()
      .del(projectKey, projectStoriesKey, projectTeamKey)
      .srem(userProjectsKey, id)
      .srem('projects', id)
      .execAsync();
  }

  /**
   * Adds a members to a project Team.
   * @static
   * @param {string} id - Project ID.
   * @param {array} team - An array of existing user's ID.
   * @returns {Promise<object> | null } A promise object with the updated project Instance.
   * @memberof ProjectService
   */
  static async addToTeam(id, team) {
    const projectTeamKey = `project:${id}:team`;
    await client.saddAsync(projectTeamKey, ...team);
    return ProjectService.fetchById(id);
  }

  /**
 * Removes a member from a project Team.
 * @static
 * @param {string} id - Project ID.
 * @param {string} memberId - An ID of a member of the team.
 * @returns {Promise<object> | null } A promise object with the updated project Instance.
 * @memberof ProjectService
 */
  static async removeFromTeam(id, memberId) {
    const projectTeamKey = `project:${id}:team`;
    await client.sremAsync(projectTeamKey, memberId);
    return ProjectService.fetchById(id);
  }
}

export default ProjectService;
