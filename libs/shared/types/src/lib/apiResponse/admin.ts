import { ApiResponse } from '.';
import { AdminBook } from '../admin';
import { UserWithoutPassword } from '../user';

export type UsersAdminApiResponse = ApiResponse<{
	users: UserWithoutPassword[];
}>;

export type DeactivateUserAdminApiResponse = ApiResponse<{
	success: boolean;
}>;

export type ActivateUserAdminApiResponse = ApiResponse<{
	success: boolean;
}>;

export type AdminBooksApiResponse = ApiResponse<{
	books: AdminBook[];
}>;

export type AdminBookApiResponse = ApiResponse<{
	book: AdminBook;
}>;

export type AdminDeleteBookApiResponse = ApiResponse<{
	success: boolean;
	bookId: string;
}>;

export type AdminBookUpdateApiResponse = ApiResponse<{
	success: boolean;
	bookId: string;
}>;

export type AdminBookCreateApiResponse = ApiResponse<{
	success: boolean;
	bookId: string;
}>;

export type AdminBookCoverUpdateApiResponse = ApiResponse<{
	coverUrl: string;
}>;
