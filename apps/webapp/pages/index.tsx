import { getAllBooks, getTrendingBooks } from '@book-rental-app/shared/utils';
import { BookGenre } from '@prisma/client';
import type { Book, BookGenre as BookGenreType } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import TrendingBooks from '../components/homepage/trending';
import {
   BrandHeader,
   BrowseHeader,
} from '@book-rental-app/shared/ui-components';
import BookGenreRow from '../components/homepage/genre';
import 'swiper/css';
import { GENRE_DISPLAYNAMES } from '@book-rental-app/shared/constants';

interface PageProps {
   books: Book[];
   trendingBooks: Book[];
   genres: Record<BookGenreType, Book[]>;
}

const Homepage: NextPage<PageProps> = ({ books, trendingBooks, genres }) => {
   return (
      <>
         <BrandHeader />
         <TrendingBooks trendingBooks={trendingBooks} />
         <BrowseHeader />
         {Object.keys(genres).map((genre) => {
            const books = genres[genre];
            const displayName = GENRE_DISPLAYNAMES[genre as BookGenre];

            if (!books.length) return null;

            return (
               <BookGenreRow
                  key={genre}
                  books={books}
                  topText={`Top ${displayName.short}bücher`}
                  genre={genre}
               />
            );
         })}
      </>
   );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
   const books = (await getAllBooks()) || [];
   const trendingBooks = (await getTrendingBooks()) || [];

   const genres: Record<string, Book[]> = {};

   for (const genre in BookGenre) {
      genres[genre] = books.filter((book) => book.genre === genre);
   }

   return {
      props: {
         books,
         trendingBooks,
         genres,
      },
      revalidate: 120,
   };
};

export default Homepage;
