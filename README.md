[![Reviewed by Hound](https://img.shields.io/badge/ESLint%20Reviewed%20by%20-HoundCI-d16ef5)](https://houndci.com)
[![Actions Status](https://github.com/daylay92/entrack-backend/workflows/Node%20CI/badge.svg)](https://github.com/daylay92/entrack-backend/actions)

---

# entrack-backend

A simple issue tracking system that enables users to manage projects.

## Features

- Users can sign up
- User can sign in
- User can log out
- User can view his/her profile
- User can a create Project
- User can view a single project he/she created
- User can update the details of his/her project
- User can view all his/her projects
- User can view all project where he/she is a team member
- User can add new registered users as a team member to a specific project
- User can remove a team member from his/her project
- User can delete his/her project



## Getting Started

To get a copy of this project up and running on your local machine for testing and development, you would need to have a minimum of the underlisted prerequisities installed on your local machine. 

### Prerequisites

You must have

1. [Node.js](https://nodejs.org/) (_v8.12.0 or higher_) and npm (_6.4.1 or higher_) installed on your local machine. Run `node -v` and `npm -v` in your terminal to confirm that you have them installed

2. GIT bash

### Installing

To get started, clone this repository on your local machine using the following steps:

Open your terminal and navigate to the folder you want the project to be and enter the the following commands:

```
$ git clone -b develop https://github.com/daylay92/entrack-backend.git
$ cd entrack-backend
$ npm install
```

Create a `.env` file and add the environment variables described in the .env.sample file. Below are the relevant environment variables worth adding:

- `SECRET` - JWT secret for signing access token.

## Starting the dev server

```bash
npm run start:dev
```

## Running the tests locally

```bash
npm test
```

## Test the endpoints

The application can be tested locally through localhost on port 3000 or through the live [url](https://entracktool.herokuapp.com/) using postman or insomnia


### API Endpoints


Method        | Endpoint      | Enable a user to: |
------------- | ------------- | ---------------
POST  | api/v1/auth/signup  | Create a user account  |
POST  | api/v1/auth/signin  | Login a user |
GET  | api/v1/auth/logout  | Logout a user |
GET  | api/v1/user  | Fetch user information |
POST  | api/v1/project  | Create a project |
GET  | api/v1/project  | Fetch a collection of users created project |
GET  | api/v1/project/<:projectId>  | Get a specific user's project by its id |
GET  | api/v1/user/team/projects | Get a collection of projects for which user is a team member |
PUT  | api/v1/project/<:projectId>  | Update a project's title and description |
PATCH  | api/v1/project/<:projectId>/team | Add a new registered user or a group of users to the team of a project |
PATCH  | api/v1/project/<:projectId>/team/<:memberId>  | Remove a single team member from a project |
DELETE  | api/v1/project/<:projectId> | Delete a project |
POST  | api/v1/question/<:id>/answer | Answer a question |
GET  | api/v1/answer/<:id> | Get a specific answer by its id |
GET  | api/v1/answer | Fetch a collection of answers |



## Technologies

- Node JS
- Express
- Redis
- Mocha & Chai
- ESLint
- Babel
- Hound CI
- Github actions CI

## API

The API is currently in version 1 (v1) and it is hosted on heroku at [Base URL](https://entracktool.herokuapp.com/api/v1)


## Author

- **Ayodele Akinbohun**
