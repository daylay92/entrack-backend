/**
 * It is the Project model.
 *
 * @class Project
 */
export default class User {
  /**
      * Project model constructor for creating a new Instance of a Project.
      * @param {object | string} options - An object that contains
      *  the properties of a new project.
      * @param {string} options.id - A unique project ID.
      * @param {string} options.ownerId - Owner's ID.
      * @param {string} options.title - The project title or name.
      * @param {string} options.description - The project description.
      * @param {string} options.team - The project team members.
      * @memberof Project
    */
  constructor(options) {
    this.id = options.id;
    this.title = options.title;
    this.owner = options.ownerId;
    this.description = options.description;
    this.team = options.team;
    this.stories = [];
    this.createdAt = new Date().toLocaleString();
    this.updatedAt = new Date().toLocaleString();
  }
}
