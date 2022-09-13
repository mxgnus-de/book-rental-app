import { Book, FavoriteBook, RentedBook } from '@prisma/client';
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

export type BookApiResponse = ApiResponse<{
	book: Book;
	isRented: boolean | RentedBook;
	isFavorite: boolean;
}>;

export type FavoriteBookUpdateApiResponse = ApiResponse<{
	state: boolean;
}>;

export type RentBookApiResponse = ApiResponse<
	| {
			success: true;
			bookId: string;
			rentedBook: RentedBook;
	  }
	| {
			success: false;
			bookId: string;
			error:
				| 'NOT_FOUND'
				| 'ALREADY_RENTED'
				| 'TOO_MANY_RENTED_BOOKS'
				| 'ALREADY_RENTED_BY_USER';
	  }
>;

export type ReturnRentedBookApiResponse = ApiResponse<
	| {
			success: true;
			bookId: string;
			rentedBook: RentedBook;
	  }
	| {
			success: false;
			bookId: string;
			error: 'NOT_FOUND' | 'NOT_RENTED' | 'NOT_RENTED_BY_USER';
	  }
>;

export type RentedBooksApiResponse = ApiResponse<{
	rentedBooks: RentedBook[];
}>;

export type FavoriteBooksApiResponse = ApiResponse<{
	favoriteBook: FavoriteBook[];
}>;
