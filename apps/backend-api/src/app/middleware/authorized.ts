import { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../helpers/error';
import { getUserFromRequest } from '../helpers/request';

export async function withLoginMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authorized = await getUserFromRequest(req);
	if (!authorized) {
		return unauthorized().send(res);
	}

	req.session = authorized.session;
	req.user = authorized.user;

	return next();
}
