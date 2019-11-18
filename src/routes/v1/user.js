import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares';
import { UserController } from '../../controllers';

const { authenticate } = AuthMiddleware;
const { fetch, fetchTeamProjects } = UserController;

const router = Router();

router.use(authenticate);

router.get('/', fetch);
router.get('/team/projects', fetchTeamProjects);

export default router;
