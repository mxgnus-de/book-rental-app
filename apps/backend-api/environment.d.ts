import { BaseEnvironment } from '../../environment.base';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends BaseEnvironment {
			DATABASE_URL: string;
			BACKENDAPI_PORT: string;
			MAIL_IMAP_HOST: string;
			MAIL_IMAP_PORT: string;
			MAIL_IMAP_USER: string;
			MAIL_IMAP_PASSWORD: string;
			CLOUDINARY_URL: string;
		}
	}
}

export {};
