import { Session, User } from '@prisma/client';
import { Request } from 'express';
import prisma from '../prisma';

export function getSessionIdFromRequest(req: Request): string | null {
	const key = req.cookies.get('session') || req.headers['authorization'];

	return key || null;
}

export function getIpFromRequest(req: Request) {
	let ip = req.headers['x-forwarded-for'] || req.ip;

	if (Array.isArray(ip)) {
		ip = ip[0];
	}

	return ip;
}

export async function getUserFromRequest(req: Request): Promise<{
	user: User;
	session: Session;
} | null> {
	const sessionId = req.sessionId;

	if (!sessionId || typeof sessionId !== 'string') return null;

	const session = await prisma.session.findUnique({
		where: {
			sessionId,
		},
		include: {
			user: true,
		},
	});

	if (!session) return null;
	return {
		session: {
			userId: session.userId,
			sessionId: session.sessionId,
			createdAt: session.createdAt,
			ip: session.ip,
		},
		user: session.user,
	};
}
