import authRoutes from './v1/auth';
import projectRoutes from './v1/project';
import userRoutes from './v1/user';

const routes = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/project', projectRoutes);
  app.use('/api/v1/user', userRoutes);
};

export default routes;
