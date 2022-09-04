import { Book } from '@prisma/client';
import { ApiResponse } from '.';

export type BooksApiResponse = ApiResponse<{
	books: Book[];
}>;

export type TrendingBooksApiResponse = ApiResponse<{
	books: Book[];
}>;

export type SearchBooksApiResponse = ApiResponse<{
	results: Book[];
	resultsCount: number;
}>;
