import {
	BookApiResponse,
	BooksApiResponse,
	FavoriteBooksApiResponse,
	FavoriteBookUpdateApiResponse,
	RentBookApiResponse,
	RentedBooksApiResponse,
	ReturnRentedBookApiResponse,
	SearchBooksApiResponse,
	TrendingBooksApiResponse,
} from '@book-rental-app/shared/types';
import { AxiosError } from 'axios';
import { apiClient } from '.';

export async function getManyBooks(bookIds?: string[], sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<BooksApiResponse>('/books', {
			headers,
			params: {
				bookId: bookIds ? bookIds : undefined,
			},
		});

		return response.data.books;
	} catch (err) {
		return [];
	}
}

export async function getTrendingBooks(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<TrendingBooksApiResponse>(
			'/books/trending',
			{
				headers,
			}
		);

		return response.data.books;
	} catch (err) {
		return null;
	}
}

export async function getBookSearchResults(
	query: string,
	sessionToken?: string
) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<SearchBooksApiResponse>(
			`/books/search?q=${query}`,
			{
				headers,
			}
		);

		return response.data;
	} catch (err) {
		return null;
	}
}

export async function getBook(bookId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<BookApiResponse>(
			`/books/details/${bookId}`,
			{
				headers,
			}
		);
		return response.data;
	} catch (error) {
		return null;
	}
}

export async function getRentedBooks(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<RentedBooksApiResponse>(
			`/books/rented`,
			{
				headers,
			}
		);
		return response.data.rentedBooks;
	} catch (error) {
		return null;
	}
}

export async function getFavoriteBooks(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<FavoriteBooksApiResponse>(
			`/books/favorites`,
			{
				headers,
			}
		);
		return response.data.favoriteBook;
	} catch (error) {
		return null;
	}
}

export async function addFavoriteBook(bookId: string, sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<FavoriteBookUpdateApiResponse>(
			`/books/${bookId}/favorite`,
			{
				headers,
			}
		);
		return response.data.state;
	} catch (error) {
		return null;
	}
}

export async function removeFavoriteBook(
	bookId: string,
	sessionToken?: string
) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.delete<FavoriteBookUpdateApiResponse>(
			`/books/${bookId}/favorite`,
			{
				headers,
			}
		);
		return response.data.state;
	} catch (error) {
		return null;
	}
}

export async function rentBook(
	bookId: string,
	sessionToken?: string
): Promise<RentBookApiResponse | null> {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<RentBookApiResponse>(
			`/books/${bookId}/rent`,
			{
				headers,
			}
		);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			return error.response?.data ?? null;
		}

		return null;
	}
}

export async function returnRentedBook(
	bookId: string,
	sessionToken?: string
): Promise<ReturnRentedBookApiResponse | null> {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.post<ReturnRentedBookApiResponse>(
			`/books/${bookId}/return`,
			{
				headers,
			}
		);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			return error.response?.data ?? null;
		}

		return null;
	}
}
