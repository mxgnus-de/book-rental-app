import { ApiRequest } from '.';

export type RegisterApiRequest = ApiRequest<{
	surname: string;
	lastname: string;
	username: string;
	email: string;
	birthday: string;
	password: string;
}>;

export type LoginApiRequest = ApiRequest<{
	usernameOrEmail: string;
	password: string;
}>;
