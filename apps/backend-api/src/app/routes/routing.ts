import { Router } from 'express';
import { withLoginMiddleware } from '../middleware/authorized';
import { withErrorHandler } from '../middleware/error';
import { meApiRouter } from './@me';
import { authRouter } from './auth';
import { bookRouter } from './books';

const mainRouter = Router();

/* API ROUTES */
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books', bookRouter);

/* AUTHORIZED API ROUTES */
const authorizedApiRoutes = Router();

authorizedApiRoutes.use(
	'/@me',
	withErrorHandler(withLoginMiddleware),
	meApiRouter
);

apiRouter.use('/', authorizedApiRoutes);
mainRouter.use('/api', apiRouter);

export default mainRouter;
