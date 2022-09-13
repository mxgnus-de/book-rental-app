import { UserApiResponse } from '@book-rental-app/shared/types';
import { Router } from 'express';
import { unauthorized } from '../../helpers/error';
import { normalizeUser } from '../../helpers/user';
import { requireAuthMiddleware } from '../../middleware/auth';
import { withErrorHandler } from '../../middleware/error';

const router = Router();

router.use(withErrorHandler(requireAuthMiddleware));

// @route GET api/@me
router.get(
	'/',
	withErrorHandler((req, res) => {
		const user = req.user;

		if (!user || !user.isVerified) return unauthorized().send(res);

		const response: UserApiResponse = {
			user: normalizeUser(user),
		};

		return res.json(response);
	})
);

export const meApiRouter = router;
