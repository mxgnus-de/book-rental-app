import {
	ActivateUserAdminApiResponse,
	AdminBookApiResponse,
	AdminBookCreateApiResponse,
	AdminBooksApiResponse,
	AdminBookUpdateApiResponse,
	AdminCreateBookApiRequest,
	AdminDeleteBookApiResponse,
	AdminUpdateBookApiRequest,
	DeactivateUserAdminApiResponse,
	UsersAdminApiResponse,
} from '@book-rental-app/shared/types';
import { apiClient } from '.';

export async function getUsers(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<UsersAdminApiResponse>(
			`/admin/users`,
			{
				headers,
			}
		);
		return response.data.users;
	} catch (error) {
		return [];
	}
}

export async function deactivateUser(userId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<DeactivateUserAdminApiResponse>(
			`/admin/users/${userId}/deactivate`,
			{
				headers,
			}
		);
		return response.data.success;
	} catch (error) {
		return false;
	}
}

export async function activateUser(userId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<ActivateUserAdminApiResponse>(
			`/admin/users/${userId}/activate`,
			{
				headers,
			}
		);
		return response.data.success;
	} catch (error) {
		return false;
	}
}

export async function getAllAdminBooks(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<AdminBooksApiResponse>(
			'/admin/books',
			{
				headers,
			}
		);
		return response.data.books;
	} catch (error) {
		return [];
	}
}

export async function getAdminBook(bookId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<AdminBookApiResponse>(
			`/admin/books/${bookId}`,
			{
				headers,
			}
		);
		return response.data.book;
	} catch (error) {
		return null;
	}
}

export async function deleteBook(bookId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.delete<AdminDeleteBookApiResponse>(
			`/admin/books/${bookId}`,
			{
				headers,
			}
		);
		return response.data.success;
	} catch (error) {
		return false;
	}
}

export async function updateBook(
	bookId: string,
	bookPayload: AdminUpdateBookApiRequest,
	sessionToken?: string
) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.put<AdminBookUpdateApiResponse>(
			`/admin/books/${bookId}`,
			bookPayload,
			{
				headers,
			}
		);
		return response.data.success;
	} catch (error) {
		return false;
	}
}

export async function createBook(
	bookPayload: AdminCreateBookApiRequest,
	sessionToken?: string
) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<AdminBookCreateApiResponse>(
			`/admin/books`,
			bookPayload,
			{
				headers,
			}
		);
		return response.data.success;
	} catch (error) {
		return false;
	}
}
