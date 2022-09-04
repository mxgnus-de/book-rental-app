import { PrismaClient } from '@prisma/client';
import { fileLogger } from '../main';

const prisma = new PrismaClient({
	log: [
		{
			level: 'query',
			emit: 'event',
		},
	],
});

prisma.$on(
	'query',
	(query) =>
		process.env.NODE_ENV !== 'production' &&
		fileLogger.debug(query.query, true)
);

export async function initializePrisma() {
	databaseIntervals();
}

export default prisma;

function databaseIntervals() {
	deleteExpiredSessions();
	deleteExpiredUserVerifications();
	deleteExpiredUserResendVerifications();

	setInterval(() => {
		deleteExpiredSessions();
		deleteExpiredUserVerifications();
		deleteExpiredUserResendVerifications();
	}, 1000 * 60 * 10);
}

async function deleteExpiredSessions() {
	const sessions = await prisma.session.findMany();

	for (const session of sessions) {
		if (session.createdAt.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7) {
			await prisma.session.delete({
				where: {
					sessionId: session.sessionId,
				},
			});
		}
	}
}

async function deleteExpiredUserVerifications() {
	const userVerifications = await prisma.userVerification.findMany();

	for (const userVerification of userVerifications) {
		if (
			userVerification.createdAt.getTime() <
			Date.now() - 1000 * 60 * 60 * 24
		) {
			await prisma.userVerification.delete({
				where: {
					userId: userVerification.userId,
				},
			});
		}
	}
}

async function deleteExpiredUserResendVerifications() {
	const userResendVerifications =
		await prisma.userVerificationResend.findMany();

	for (const userVerification of userResendVerifications) {
		if (userVerification.createdAt.getTime() < Date.now() - 1000 * 60 * 60) {
			await prisma.userVerificationResend.delete({
				where: {
					resendCode: userVerification.resendCode,
				},
			});
		}
	}
}
