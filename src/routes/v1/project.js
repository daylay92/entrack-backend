import { Router } from 'express';
import { AuthMiddleware, ProjectMiddleware } from '../../middlewares';
import { ProjectController } from '../../controllers';
import { updateSchema, teamSchema } from '../../validations';

const router = Router();

const {
  create,
  getProjects,
  getProject,
  modifyProject,
  deleteProject,
  addMembersToTeam,
  removeMemberFromTeam
} = ProjectController;
const { authenticate, validUserId } = AuthMiddleware;
const {
  validate,
  verifyTeam,
  isProjectExist,
  isProjectOwner,
  isProjectTeamMember,
  verifyMember,
  isMemberAlready
} = ProjectMiddleware;

router.use(authenticate);
router.post('/', validate(), verifyTeam, create);
router.get('/', getProjects);
router.get('/:projectId', isProjectExist, isProjectTeamMember, getProject);
router.put('/:projectId', isProjectExist, isProjectOwner, validate(updateSchema), modifyProject);
router.delete('/:projectId', isProjectExist, isProjectOwner, deleteProject);
router.patch(
  '/:projectId/team',
  isProjectExist,
  isProjectOwner,
  validate(teamSchema),
  verifyTeam,
  isMemberAlready,
  addMembersToTeam
);
router.patch(
  '/:projectId/team/:memberId',
  isProjectExist,
  isProjectOwner,
  validUserId,
  verifyMember,
  removeMemberFromTeam
);

export default router;
