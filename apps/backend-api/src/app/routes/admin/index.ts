import {
	AdminBook,
	AdminBookApiResponse,
	AdminBookCoverUpdateApiResponse,
	AdminBookCreateApiResponse,
	AdminBooksApiResponse,
	AdminBookUpdateApiResponse,
	AdminCreateBookApiRequest,
	AdminDeleteBookApiResponse,
	AdminUpdateBookApiRequest,
	DeactivateUserAdminApiResponse,
	UsersAdminApiResponse,
} from '@book-rental-app/shared/types';
import { UserPermission } from '@book-rental-app/shared/utils';
import { Router } from 'express';
import { badRequest } from '../../helpers/error';
import { revalidateFrontendBooks } from '../../helpers/revalidation';
import { normalizeUser } from '../../helpers/user';
import { requireAdminAuthMiddleware } from '../../middleware/auth';
import { withErrorHandler } from '../../middleware/error';
import prisma from '../../prisma';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

const router = Router();

router.use(withErrorHandler(requireAdminAuthMiddleware));

// @route GET api/admin/users
router.get(
	'/users',
	withErrorHandler(async (req, res) => {
		const users = await prisma.user.findMany();

		const normalizedUsers = users.map(normalizeUser);

		const response: UsersAdminApiResponse = {
			users: normalizedUsers,
		};

		return res.json(response);
	})
);

// @route POST api/admin/users/:userId/deactivate
router.post(
	'/users/:userId/deactivate',
	withErrorHandler(async (req, res) => {
		const { userId } = req.params;

		const user = await prisma.user.findUnique({
			where: { userId },
		});
		const userPermissions = new UserPermission(user);

		if (!user) return badRequest('User not found').send(res);
		else if (userPermissions.hasPermission('ADMIN'))
			return badRequest('Cannot deactivate admin user').send(res);
		else if (user.isDeactivated)
			return badRequest('User is already deactivated').send(res);

		await prisma.user.update({
			where: { userId },
			data: {
				isDeactivated: true,
			},
		});

		await prisma.session.deleteMany({
			where: {
				userId,
			},
		});

		const response: DeactivateUserAdminApiResponse = {
			success: true,
		};

		return res.json(response);
	})
);

// @route POST api/admin/users/:userId/activate
router.post(
	'/users/:userId/activate',
	withErrorHandler(async (req, res) => {
		const { userId } = req.params;

		const user = await prisma.user.findUnique({
			where: { userId },
		});
		const userPermissions = new UserPermission(user);

		if (!user) return badRequest('User not found').send(res);
		else if (userPermissions.hasPermission('ADMIN'))
			return badRequest('Cannot activate admin user').send(res);
		else if (!user.isDeactivated)
			return badRequest('User is already activated').send(res);

		await prisma.user.update({
			where: { userId },
			data: {
				isDeactivated: false,
			},
		});

		const response: DeactivateUserAdminApiResponse = {
			success: true,
		};

		return res.json(response);
	})
);

// @route GET api/admin/books
router.get(
	'/books',
	withErrorHandler(async (req, res) => {
		const books = await prisma.book.findMany({
			include: {
				rentedBook: true,
				favoriteBook: true,
			},
		});

		const normalizedBooks: AdminBook[] = books.map((book) => ({
			bookId: book.bookId,
			name: book.name,
			author: book.author,
			cover: book.cover,
			createdAt: book.createdAt,
			description: book.description,
			genre: book.genre,
			isbn: book.isbn,
			publishedAt: book.publishedAt,
			favoriteCount: book.favoriteBook.length,
			totalRentCount: book.rentedBook.length,
			isRented: book.rentedBook.some(
				(rentedBook) => rentedBook.isRented === true
			),
		}));

		const response: AdminBooksApiResponse = {
			books: normalizedBooks,
		};

		return res.json(response);
	})
);

// @route GET api/admin/books/:bookId
router.get(
	'/books/:bookId',
	withErrorHandler(async (req, res) => {
		const { bookId } = req.params;

		const book = await prisma.book.findUnique({
			where: { bookId },
			include: {
				rentedBook: true,
				favoriteBook: true,
			},
		});

		if (!book) return badRequest('Book not found').send(res);

		const normalizedBook: AdminBook = {
			bookId: book.bookId,
			name: book.name,
			description: book.description,
			genre: book.genre,
			isbn: book.isbn,
			publishedAt: book.publishedAt,
			createdAt: book.createdAt,
			cover: book.cover,
			author: book.author,
			isRented: book.rentedBook.some(
				(rentedBook) => rentedBook.isRented === true
			),
			favoriteCount: book.favoriteBook.length,
			totalRentCount: book.rentedBook.length,
		};

		const response: AdminBookApiResponse = {
			book: normalizedBook,
		};

		return res.json(response);
	})
);

// @route DELETE api/admin/books/:bookId
router.delete(
	'/books/:bookId',
	withErrorHandler(async (req, res) => {
		const { bookId } = req.params;

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
			include: {
				rentedBook: true,
			},
		});

		if (!book) return badRequest('Book not found').send(res);
		else if (
			book.rentedBook.some((rentedBook) => rentedBook.isRented === true)
		)
			return badRequest('Book is currently rented').send(res);

		await prisma.favoriteBook.deleteMany({
			where: {
				bookId,
			},
		});

		await prisma.rentedBook.deleteMany({
			where: {
				bookId,
			},
		});

		await prisma.book.delete({
			where: {
				bookId,
			},
		});

		await revalidateFrontendBooks(bookId);

		const response: AdminDeleteBookApiResponse = {
			success: true,
			bookId,
		};

		return res.json(response);
	})
);

// @route POST api/admin/books
router.post(
	'/books',
	withErrorHandler(async (req, res) => {
		const { name, author, description, genre, isbn, publishedAt, cover } =
			req.body as AdminCreateBookApiRequest;

		if (!name || !author || !genre || !isbn || !publishedAt)
			return badRequest('Missing required fields').send(res);
		else if (cover && !cover.startsWith('https://res.cloudinary.com'))
			return badRequest('Invalid cover url').send(res);

		const existingBook = await prisma.book.findFirst({
			where: {
				name,
				OR: {
					isbn,
				},
			},
		});

		if (existingBook) {
			return badRequest('Book already exists').send(res);
		}

		const book = await prisma.book.create({
			data: {
				name,
				author,
				cover: cover || '',
				description,
				genre,
				isbn,
				publishedAt,
			},
		});

		await revalidateFrontendBooks(book.bookId);

		const response: AdminBookCreateApiResponse = {
			success: true,
			bookId: book.bookId,
		};

		return res.json(response);
	})
);

// @route PUT api/admin/books/:bookId
router.put(
	'/books/:bookId',
	withErrorHandler(async (req, res) => {
		const { bookId } = req.params;
		const { name, author, cover, description, genre, isbn, publishedAt } =
			req.body as AdminUpdateBookApiRequest;

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) return badRequest('Book not found').send(res);

		if (cover && !cover.startsWith('https://res.cloudinary.com')) {
			return badRequest('Cover must be an Cloudinary URL').send(res);
		}

		await prisma.book.update({
			where: {
				bookId,
			},
			data: {
				name: name || book.name,
				author: author || book.author,
				cover: cover || book.cover,
				description,
				genre: genre || book.genre,
				isbn: isbn || book.isbn,
				publishedAt: publishedAt || book.publishedAt,
			},
		});

		await revalidateFrontendBooks(bookId);

		const response: AdminBookUpdateApiResponse = {
			success: true,
			bookId,
		};

		return res.json(response);
	})
);

// @route POST api/admin/books/:bookId/cover
router.post(
	'/books/:bookId/cover',
	withErrorHandler(async (req, res) => {
		const form = new formidable.IncomingForm();
		const parsedForm = await new Promise<{
			fields: formidable.Fields;
			files: any;
		}>((resolve, reject) => {
			form.parse(req, (err, fields, files) => {
				if (err) {
					return reject(err);
				}

				const obj = {
					fields,
					files,
				};

				return resolve(obj);
			});
		});

		const cover = parsedForm.files.cover;

		if (!cover || Array.isArray(cover)) {
			return badRequest('Cover is required').send(res);
		}

		const sizeInKB = Math.round(cover.size / 1024);

		if (sizeInKB > 2048) {
			return badRequest('Cover is too large').send(res);
		}

		const { bookId } = req.params;

		const book = await prisma.book.findUnique({
			where: {
				bookId,
			},
		});

		if (!book) {
			return badRequest('Book not found').send(res);
		}

		const uploadedImage = await cloudinary.uploader.upload(
			cover._writeStream.path,
			{
				folder: 'book-rental-app/books',
				unique_filename: true,
				use_filename: true,
				public_id: bookId,
			}
		);

		const newCoverUrl = uploadedImage.url.replace('http://', 'https://');

		await fs.unlink(cover._writeStream.path);

		await prisma.book.update({
			where: {
				bookId,
			},
			data: {
				cover: newCoverUrl,
			},
		});

		const response: AdminBookCoverUpdateApiResponse = {
			coverUrl: newCoverUrl,
		};

		return res.json(response);
	})
);

export const adminRouter = router;
