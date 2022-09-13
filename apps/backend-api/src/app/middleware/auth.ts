import { UserPermission } from '@book-rental-app/shared/utils';
import { NextFunction, Request, Response } from 'express';
import { forbidden, unauthorized } from '../helpers/error';
import { getUserFromRequest } from '../helpers/request';

export async function requireAuthMiddleware(
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

export async function requireAdminAuthMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authorized = await getUserFromRequest(req);
	if (!authorized) {
		return unauthorized().send(res);
	}

	const userPermissions = new UserPermission(authorized.user);

	if (!userPermissions.hasPermission('ADMIN')) {
		return forbidden().send(res);
	}

	req.session = authorized.session;
	req.user = authorized.user;

	return next();
}
