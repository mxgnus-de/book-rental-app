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
import { Router } from 'express';
import { badRequest, notFound, unauthorized } from '../../helpers/error';
import { getUserFromRequest } from '../../helpers/request';
import { requireAuthMiddleware } from '../../middleware/auth';
import { withErrorHandler } from '../../middleware/error';
import prisma from '../../prisma';

const router = Router();

// @router GET api/books
router.get(
	'/',
	withErrorHandler(async (req, res) => {
		const { bookId } = req.query;

		let searchForIds = [];

		if (bookId && typeof bookId === 'string') {
			searchForIds = bookId.split(',');
		} else if (bookId && Array.isArray(bookId)) {
			searchForIds = bookId;
		}

		const books = await prisma.book.findMany({
			where: {
				bookId: searchForIds.length
					? {
							in: searchForIds,
					  }
					: undefined,
			},
		});

		const response: BooksApiResponse = {
			books,
		};

		return res.json(response);
	})
);

// @router GET api/books/trending
router.get(
	'/trending',
	withErrorHandler(async (req, res) => {
		const rentedBooks = await prisma.rentedBook.findMany({});

		const timesRented = new Map<string, number>();

		rentedBooks.forEach((rentedBook) => {
			const bookId = rentedBook.bookId;
			const timesRentedForBook = timesRented.get(bookId) || 0;
			timesRented.set(bookId, timesRentedForBook + 1);
		});

		const sortedBooks = Array.from(timesRented)
			.sort(
				([, timesRentedA], [, timesRentedB]) => timesRentedB - timesRentedA
			)
			.slice(0, 5);

		let books = await prisma.book.findMany({
			where: {
				bookId: {
					in: sortedBooks.map(([bookId]) => bookId),
				},
			},
		});

		if (books.length < 10) {
			const neededBooks = 10 - books.length;
			const newBooks = await prisma.book.findMany({});

			const randomBooks = newBooks.sort(() => 0.5 - Math.random());
			books = randomBooks.slice(0, neededBooks);
		}

		const response: TrendingBooksApiResponse = {
			books,
		};

		return res.json(response);
	})
);

// @router GET api/books/search
router.get(
	'/search',
	withErrorHandler(async (req, res) => {
		const { q: query, limit } = req.query;

		if (!query || typeof query !== 'string') {
			return badRequest('Query must be a string').send(res);
		} else if (typeof limit === 'string' && isNaN(parseInt(limit))) {
			return badRequest('Limit must be a number').send(res);
		}

		const parsedLimit = typeof limit === 'string' ? parseInt(limit) : 10;

		const searchResults = await prisma.book.findMany({
			take: parsedLimit,
			where: {
				OR: [
					{
						isbn: {
							contains: query,
						},
					},
					{
						bookId: {
							contains: query,
						},
					},
					{
						author: {
							startsWith: query,
						},
					},
					{
						description: {
							contains: query,
						},
					},
					{
						name: {
							contains: query,
						},
					},
				],
			},
		});

		const response: SearchBooksApiResponse = {
			results: searchResults,
			resultsCount: searchResults.length,
		};

		return res.json(response);
	})
);

// @router GET api/books/details/:bookId
router.get(
	'/details/:bookId',
	withErrorHandler(async (req, res) => {
		const bookId = req.params.bookId;
		const user = await getUserFromRequest(req);

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
			include: {
				rentedBook: {
					include: {
						book: true,
					},
					where: {
						isRented: true,
					},
				},
				favoriteBook: {
					where: {
						userId: user?.user?.userId,
					},
				},
			},
		});

		if (!book) {
			return notFound('Book not found').send(res);
		}

		const rentedBook = book.rentedBook[0];
		const favoriteBook = book.favoriteBook[0] || null;

		const isRented = !!rentedBook;
		const rentedByUser = isRented
			? rentedBook?.userId === user?.user.userId
			: false;
		const isFavorite = user
			? favoriteBook?.userId === user?.user.userId || false
			: false;

		const response: BookApiResponse = {
			book: {
				bookId: book.bookId,
				name: book.name,
				description: book.description,
				author: book.author,
				cover: book.cover,
				createdAt: book.createdAt,
				genre: book.genre,
				isbn: book.isbn,
				publishedAt: book.publishedAt,
			},
			isRented: rentedByUser ? rentedBook : isRented,
			isFavorite,
		};

		return res.json(response);
	})
);

// @router POST api/books/:bookId/favorite
router.post(
	'/:bookId/favorite',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const bookId = req.params.bookId;
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) {
			return notFound('Book not found').send(res);
		}

		const favoriteBook = await prisma.favoriteBook.findFirst({
			where: {
				bookId,
				AND: {
					userId: user.userId,
				},
			},
		});

		if (favoriteBook) {
			return badRequest('Book is already favorited').send(res);
		} else {
			await prisma.favoriteBook.create({
				data: {
					bookId,
					userId: user.userId,
				},
			});
		}

		const response: FavoriteBookUpdateApiResponse = {
			state: true,
		};

		return res.json(response);
	})
);

// @router DELETE api/books/:bookId/favorite
router.delete(
	'/:bookId/favorite',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const bookId = req.params.bookId;
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) {
			return notFound('Book not found').send(res);
		}

		const favoriteBook = await prisma.favoriteBook.findFirst({
			where: {
				bookId,
				AND: {
					userId: user.userId,
				},
			},
		});

		if (!favoriteBook) {
			return badRequest('Book is not favorite').send(res);
		} else {
			await prisma.favoriteBook.delete({
				where: {
					id: favoriteBook.id,
				},
			});
		}

		const response: FavoriteBookUpdateApiResponse = {
			state: false,
		};

		return res.json(response);
	})
);

// @router POST api/books/:bookId/rent
router.post(
	'/:bookId/rent',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const bookId = req.params.bookId;
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) {
			const response: RentBookApiResponse = {
				success: false,
				bookId,
				error: 'NOT_FOUND',
			};

			return res.status(404).json(response);
		}

		const rentedBook = await prisma.rentedBook.findFirst({
			where: {
				bookId,
			},
		});

		if (
			rentedBook &&
			rentedBook.isRented &&
			rentedBook.userId === user.userId
		) {
			const response: RentBookApiResponse = {
				success: false,
				bookId,
				error: 'ALREADY_RENTED_BY_USER',
			};

			return res.status(400).json(response);
		} else if (rentedBook && rentedBook.isRented) {
			const response: RentBookApiResponse = {
				success: false,
				bookId,
				error: 'ALREADY_RENTED',
			};

			return res.status(400).json(response);
		}

		const rentedBooksFromUser = await prisma.rentedBook.findMany({
			where: {
				userId: user.userId,
				AND: {
					isRented: true,
				},
			},
		});

		if (rentedBooksFromUser.length >= 3) {
			const response: RentBookApiResponse = {
				success: false,
				bookId,
				error: 'TOO_MANY_RENTED_BOOKS',
			};

			return res.status(400).json(response);
		}

		const newRentedBook = await prisma.rentedBook.create({
			data: {
				bookId,
				isRented: true,
				rentedAt: new Date(),
				userId: user.userId,
			},
		});

		const response: RentBookApiResponse = {
			success: true,
			bookId,
			rentedBook: newRentedBook,
		};

		return res.json(response);
	})
);

// @router POST api/books/:bookId/return
router.post(
	'/:bookId/return',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const bookId = req.params.bookId;
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) {
			const response: ReturnRentedBookApiResponse = {
				success: false,
				bookId,
				error: 'NOT_FOUND',
			};

			return res.status(404).json(response);
		}

		const rentedBook = await prisma.rentedBook.findFirst({
			where: {
				bookId,
				AND: {
					isRented: true,
				},
			},
		});

		if (!rentedBook) {
			const response: ReturnRentedBookApiResponse = {
				success: false,
				bookId,
				error: 'NOT_RENTED',
			};

			return res.status(400).json(response);
		}

		if (rentedBook.userId !== user.userId) {
			const response: ReturnRentedBookApiResponse = {
				success: false,
				bookId,
				error: 'NOT_RENTED_BY_USER',
			};

			return res.status(400).json(response);
		}

		const updatedRentedBook = await prisma.rentedBook.update({
			where: {
				id: rentedBook.id,
			},
			data: {
				isRented: false,
				returnedAt: new Date(),
			},
		});

		const response: ReturnRentedBookApiResponse = {
			success: true,
			bookId,
			rentedBook: updatedRentedBook,
		};

		return res.json(response);
	})
);

// @router GET api/books/rented
router.get(
	'/rented',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const rentedBooks = await prisma.rentedBook.findMany({
			where: {
				userId: user.userId,
				AND: {
					isRented: true,
				},
			},
		});

		const response: RentedBooksApiResponse = {
			rentedBooks,
		};

		return res.json(response);
	})
);

// @router GET api/books/favorites
router.get(
	'/favorites',
	requireAuthMiddleware,
	withErrorHandler(async (req, res) => {
		const user = req.user;

		if (!user) {
			return unauthorized().send(res);
		}

		const favoriteBook = await prisma.favoriteBook.findMany({
			where: {
				userId: user.userId,
			},
		});

		const response: FavoriteBooksApiResponse = {
			favoriteBook,
		};

		return res.json(response);
	})
);

export const bookRouter = router;
