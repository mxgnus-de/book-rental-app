import { ApiResponse } from '.';
import { UserWithoutPassword } from '../user';

export type RegisterApiResponse = ApiResponse<{
	success: boolean;
	userId: string;
}>;

export type LoginApiResponse = ApiResponse<
	| {
			success: true;
			sessionId: string;
			user: UserWithoutPassword;
	  }
	| {
			success: false;
			isVerified?: false;
			email?: string;
			resendCode?: string;
	  }
>;

export type LogoutApiResponse = ApiResponse<{
	success: boolean;
}>;

export type ResendVerificationCodeResponse = ApiResponse<{
	success: boolean;
	email?: string;
}>;
