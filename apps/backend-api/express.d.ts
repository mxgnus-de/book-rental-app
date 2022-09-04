import { Session, User } from '@prisma/client';
import Cookies from 'cookies';

declare global {
	namespace Express {
		interface Request {
			cookies: Cookies;

			/**
			 * @description The real IP address of the client.
			 */
			realIp: string;

			/**
			 * @description The access key of the client.
			 */
			sessionId?: string;
			/**
			 * @description Session object if available
			 */
			session?: Session;
			/**
			 * @description User object if available
			 */
			user?: User;
		}
		interface Response {
			cookies: Cookies;
		}
	}
}

export {};
