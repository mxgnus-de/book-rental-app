import { ApiResponse } from '.';
import { UserWithoutPassword } from '../user';

export type UserApiResponse = ApiResponse<{
	user: UserWithoutPassword;
}>;
