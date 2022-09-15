const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const { createSpinner } = require('nanospinner');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const spinner = createSpinner('Exporting books...');

async function main() {
	const { outputFileName } = await inquirer.prompt([
		{
			name: 'outputFileName',
			type: 'input',
			default: 'exportedBooks',
			message: 'Output file name',
			validate: (input) =>
				input.endsWith('.json')
					? 'Output file name must not end with ".json"'
					: true,
		},
	]);

	spinner.start();

	const books = await prisma.book.findMany({});

	const stringifiedBooks = JSON.stringify(books, null, 2);

	fs.writeFileSync(
		path.join(process.cwd(), `data/${outputFileName}.json`),
		stringifiedBooks
	);

	spinner.success();

	console.log(`Exported ${books.length} books to data/${outputFileName}.json`);
}

main().catch((err) => {
	console.error(err);
	spinner.error();
	process.exit(1);
});
