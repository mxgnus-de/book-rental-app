const { PrismaClient } = require('@prisma/client');
const bookData = require('../../data/exampleBookList.json');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const { createSpinner } = require('nanospinner');

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

const prisma = new PrismaClient();

cloudinary.config();

const spinner = createSpinner('Seeding data...');

async function seedData() {
	const { seedFileName } = await inquirer.prompt([
		{
			name: 'seedFileName',
			type: 'input',
			default: 'exampleBookList.json',
			message: 'Seed file name',
			validate: (input) =>
				!input.endsWith('.json')
					? 'Seed file name must end with ".json"'
					: fs.existsSync(path.join(process.cwd(), `data/${input}`)) ===
					  false
					? `Seed file does not exist (data/${input})`
					: true,
		},
	]);

	spinner.start();
	const startTime = Date.now();

	const bookData = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), `data/${seedFileName}`), 'utf8')
	);

	await Promise.all(
		bookData.map(async (book) => {
			const publishedAt =
				typeof new Date(book.publishedAt).getTime() === 'number' &&
				!isNaN(new Date(book.publishedAt).getTime())
					? new Date(book.publishedAt)
					: new Date(book.publishedAt.split('.').reverse().join('-'));

			const existingBook = await prisma.book.findFirst({
				where: {
					name: book.name,
				},
			});

			if (existingBook) {
				console.log(`Book ${book.name} already exists`);
				return;
			}

			const newBook = await prisma.book.create({
				data: {
					name: book.name,
					author: book.author,
					description: book.description || null,
					genre: book.genre,
					cover: '',
					isbn: book.isbn,
					publishedAt,
				},
			});

			const uploadedCover = await cloudinary.uploader.upload(book.cover, {
				folder: 'book-rental-app/books',
				public_id: newBook.bookId,
				use_filename: true,
				unique_filename: true,
			});

			const coverUrl = uploadedCover.url.replace('http://', 'https://');

			await prisma.book.update({
				where: {
					bookId: newBook.bookId,
				},
				data: {
					cover: coverUrl,
				},
			});

			console.log(
				`Created book ${book.name} | ${book.author} (${book.isbn})`
			);
		})
	);

	spinner
		.update({
			text: `Seeded ${bookData.length} books in ${Date.now() - startTime}ms`,
		})
		.success();
	console.log('Done!');
}

seedData().catch((err) => {
	console.error(err);
	spinner.error();
	process.exit(1);
});
