import { withErrorHandler } from './../../middleware/error';
import {
	LoginApiRequest,
	LoginApiResponse,
	LogoutApiResponse,
	RegisterApiRequest,
	RegisterApiResponse,
	ResendVerificationCodeResponse,
} from '@book-rental-app/shared/types';
import { emailRegex, generateUid } from '@book-rental-app/shared/utils';
import { Router } from 'express';
import {
	badRequest,
	internalServerError,
	unauthorized,
} from '../../helpers/error';
import prisma from '../../prisma';
import bcrypt from 'bcrypt';
import { normalizeUser } from '../../helpers/user';
import { requireAuthMiddleware } from '../../middleware/auth';
import {
	queueAccountVerificationTemplate,
	queueAccountVerifiedTemplate,
} from '../../email/templates';

const router = Router();

// @route POST api/auth/register
router.post(
	'/register',
	withErrorHandler(async (req, res) => {
		const { email, password, birthday, lastname, surname, username } =
			req.body as RegisterApiRequest;

		if (
			!email ||
			!password ||
			!birthday ||
			!lastname ||
			!surname ||
			!username
		) {
			return badRequest('Please provide all required fields').send(res);
		} else if (password.length < 8) {
			return badRequest('Password must be at least 8 characters long').send(
				res
			);
		} else if (!emailRegex.test(email)) {
			return badRequest('Please provide a valid email').send(res);
		} else if (!birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
			return badRequest('Please provide a valid birthday').send(res);
		}

		const userExists = await prisma.user.findMany({
			where: {
				email,
				OR: {
					username,
				},
			},
		});

		if (userExists.length) {
			return badRequest('User already exists').send(res);
		}

		const user = await prisma.user.create({
			data: {
				birthday: new Date(birthday),
				email,
				lastname,
				surname,
				username,
				password: bcrypt.hashSync(password, 10),
			},
		});

		if (!user) return internalServerError('Something went wrong').send(res);

		const token = generateUid(256);
		const userVerification = await prisma.userVerification.create({
			data: {
				userId: user.userId,
				verificationCode: token,
			},
		});

		queueAccountVerificationTemplate({
			props: {
				username: user.username,
				email: email,
				verificationCode: userVerification.verificationCode,
			},
			mailOptions: {
				to: user.email,
			},
		});

		const response: RegisterApiResponse = {
			success: true,
			userId: user.userId,
		};

		return res.status(201).send(response);
	})
);

// @route GET api/auth/verify?token=...
router.get(
	'/verify',
	withErrorHandler(async (req, res) => {
		const { token } = req.query;

		if (!token || typeof token !== 'string')
			return badRequest('Please provide a valid token').send(res);

		const userVerification = await prisma.userVerification.findUnique({
			where: {
				verificationCode: token,
			},
		});

		if (!userVerification) return badRequest('Invalid token').send(res);

		const user = await prisma.user.findUnique({
			where: {
				userId: userVerification.userId,
			},
		});

		if (!user) return internalServerError('Something went wrong').send(res);

		await prisma.userVerification.delete({
			where: {
				verificationCode: token,
			},
		});

		await prisma.user.update({
			where: {
				userId: user.userId,
			},
			data: {
				isVerified: true,
			},
		});

		queueAccountVerifiedTemplate({
			props: {
				email: user.email,
				username: user.username,
			},
			mailOptions: {
				to: user.email,
			},
		});

		return res.redirect(`${process.env.NEXT_PUBLIC_SERVICE_URL}/login`);
	})
);

// @route POST api/auth/login
router.post(
	'/login',
	withErrorHandler(async (req, res) => {
		const { usernameOrEmail, password } = req.body as LoginApiRequest;

		if (!usernameOrEmail || !password) {
			return badRequest('Please provide a valid username or email').send(
				res
			);
		}

		const isEmail = emailRegex.test(usernameOrEmail);
		const user = await prisma.user.findUnique({
			where: {
				email: isEmail ? usernameOrEmail : undefined,
				username: isEmail ? undefined : usernameOrEmail,
			},
		});

		if (!user) {
			return badRequest('User not found').send(res);
		} else if (!user.isVerified) {
			const verificationResendCode =
				await prisma.userVerificationResend.upsert({
					where: {
						userId: user.userId,
					},
					create: {
						resendCode: generateUid(256),
						userId: user.userId,
					},
					update: {},
				});

			const response: LoginApiResponse = {
				success: false,
				isVerified: false,
				email: user.email,
				resendCode: verificationResendCode.resendCode,
			};

			return res.json(response);
		} else if (user.isDeactivated) {
			const response: LoginApiResponse = {
				success: false,
				isDeactivated: true,
			};

			return res.json(response);
		} else if (!bcrypt.compareSync(password, user.password)) {
			return badRequest('Invalid password').send(res);
		}

		const newSessionId = generateUid(64);
		await prisma.session.create({
			data: {
				userId: user.userId,
				ip: req.realIp,
				sessionId: newSessionId,
			},
		});

		const response: LoginApiResponse = {
			success: true,
			sessionId: newSessionId,
			user: normalizeUser(user),
		};

		return res.json(response);
	})
);

// @route POST api/auth/logout
router.post(
	'/logout',
	withErrorHandler(requireAuthMiddleware),
	withErrorHandler(async (req, res) => {
		const session = req.session;
		if (!session) return unauthorized().send(res);

		await prisma.session.delete({
			where: {
				sessionId: session.sessionId,
			},
		});

		const response: LogoutApiResponse = {
			success: true,
		};

		return res.json(response);
	})
);

// @route POST api/auth/resend-verification-code?token=...
router.post(
	'/resend-verification-code',
	withErrorHandler(async (req, res) => {
		const { token } = req.query;

		if (!token || typeof token !== 'string')
			return badRequest('Please provide a valid token').send(res);

		const resendVerificationCode =
			await prisma.userVerificationResend.findUnique({
				where: {
					resendCode: token,
				},
				include: {
					user: true,
				},
			});

		if (!resendVerificationCode)
			return badRequest('Please provide a valid token').send(res);

		const user = resendVerificationCode.user;

		await prisma.userVerificationResend.delete({
			where: {
				resendCode: resendVerificationCode.resendCode,
			},
		});

		const verificationCode = await prisma.userVerification.upsert({
			where: {
				userId: user.userId,
			},
			create: {
				userId: user.userId,
				verificationCode: generateUid(256),
			},
			update: {},
		});

		queueAccountVerificationTemplate({
			props: {
				username: user.username,
				email: user.email,
				verificationCode: verificationCode.verificationCode,
			},
			mailOptions: {
				to: user.email,
			},
		});

		const response: ResendVerificationCodeResponse = {
			success: true,
			email: user.email,
		};

		return res.json(response);
	})
);

export const authRouter = router;
