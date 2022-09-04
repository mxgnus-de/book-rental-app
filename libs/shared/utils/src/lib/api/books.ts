import {
	BooksApiResponse,
	SearchBooksApiResponse,
	TrendingBooksApiResponse,
} from '@book-rental-app/shared/types';
import { apiClient } from '.';

export async function getAllBooks() {
	try {
		const response = await apiClient.get<BooksApiResponse>('/books');

		return response.data.books;
	} catch (err) {
		return null;
	}
}

export async function getTrendingBooks() {
	try {
		const response = await apiClient.get<TrendingBooksApiResponse>(
			'/books/trending'
		);

		return response.data.books;
	} catch (err) {
		return null;
	}
}

export async function getBookSearchResults(query: string) {
	try {
		const response = await apiClient.get<SearchBooksApiResponse>(
			`/books/search?q=${query}`
		);

		return response.data;
	} catch (err) {
		return null;
	}
}
