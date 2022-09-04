import {
	BooksApiResponse,
	SearchBooksApiResponse,
	TrendingBooksApiResponse,
} from '@book-rental-app/shared/types';
import { Router } from 'express';
import { badRequest } from '../../helpers/error';
import { withErrorHandler } from '../../middleware/error';
import prisma from '../../prisma';

const router = Router();

// @router GET api/books
router.get(
	'/',
	withErrorHandler(async (req, res) => {
		const books = await prisma.book.findMany({});

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

export const bookRouter = router;
