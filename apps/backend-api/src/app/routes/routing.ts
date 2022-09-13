import { Router } from 'express';
import { meApiRouter } from './@me';
import { adminRouter } from './admin';
import { authRouter } from './auth';
import { bookRouter } from './books';

const mainRouter = Router();

/* API ROUTES */
const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books', bookRouter);
apiRouter.use('/@me', meApiRouter);
apiRouter.use('/admin', adminRouter);

mainRouter.use('/api', apiRouter);

export default mainRouter;
