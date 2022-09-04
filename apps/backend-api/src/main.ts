import { FileLogger } from '@book-rental-app/loggers';
export const fileLogger = new FileLogger('backend-api');
import express from 'express';
import cookies from 'cookies';
import cors from 'cors';
import { initializePrisma } from './app/prisma';
import { generateUid } from '@book-rental-app/shared/utils';
import errorHandlerMiddleware, {
	withErrorHandler,
} from './app/middleware/error';
import {
	getIpFromRequest,
	getSessionIdFromRequest,
} from './app/helpers/request';
import ApiError from './app/helpers/error';
import mainRouter from './app/routes/routing';
import { startMailWorker } from './app/email';

prepare().then(main);

const PORT = process.env.BACKENDAPI_PORT || 8080;
const app = express();

async function prepare() {
	const startTime = Date.now();
	fileLogger.debug('Preparing backend-api...');

	await initializePrisma();
	startMailWorker();

	fileLogger.debug(`Backend-api prepared in ${Date.now() - startTime}ms`);
}

async function main() {
	const startTime = Date.now();
	fileLogger.debug('Starting backend-api...');

	app.use(
		cors({
			credentials: true,
			origin: true,
		})
	);
	app.disable('x-powered-by');
	app.use(withErrorHandler(express.json()));
	app.use(
		cookies.express([generateUid(10), generateUid(10), generateUid(10)])
	);
	app.use((req, _, next) => {
		req.realIp = getIpFromRequest(req);
		req.sessionId = getSessionIdFromRequest(req) || undefined;
		return next();
	});

	app.use('/', mainRouter);

	app.all('*', (req, res) =>
		new ApiError({
			statusCode: 'NOT_FOUND',
			message: 'This endpoint does not exist',
			fields: {
				version: '0.0.1',
				endpoint: req.originalUrl,
			},
		}).send(res)
	);

	app.use(errorHandlerMiddleware);

	app.listen(PORT, () => {
		fileLogger.info(
			`Backend-api started in ${
				Date.now() - startTime
			}ms on port ${PORT}. Environment: ${
				process.env.NODE_ENV || 'development'
			}`
		);
	});
}

process.on('uncaughtException', (exeption) => {
	fileLogger.error('Unhandled Exeption: ' + exeption);
});
