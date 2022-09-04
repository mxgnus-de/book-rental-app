const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function generateRemotePetterns() {
   const domains = [];

   const books = await prisma.book.findMany({});

   for (const book of books) {
      const { cover } = book;

      const { hostname } = new URL(cover);

      if (!domains.includes(hostname)) {
         domains.push(hostname);
      }
   }

   const remotePatterns = domains.map((domain) => {
      return {
         hostname: domain,
      };
   });

   fs.writeFileSync(
      path.join(process.cwd(), 'data', 'remotePatterns.json'),
      JSON.stringify(remotePatterns, null, 2)
   );
}

generateRemotePetterns();
