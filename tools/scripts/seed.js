const { PrismaClient } = require('@prisma/client');
const bookData = require('../../data/exampleBookList.json');

const prisma = new PrismaClient();

async function seedData() {
   for (const book of bookData) {
      const publishedAt = new Date(
         book.publishedAt.split('.').reverse().join('-')
      );

      await prisma.book.create({
         data: {
            name: book.name,
            author: book.author,
            description: book.description || null,
            genre: book.genre,
            cover: book.cover,
            isbn: book.isbn,
            publishedAt,
         },
      });

      console.log(`Created book ${book.name} | ${book.author} (${book.isbn})`);
   }
}

seedData();
