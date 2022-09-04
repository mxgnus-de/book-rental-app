import { BookGenre } from '@prisma/client';

export const GENRE_DISPLAYNAMES: Record<
   BookGenre,
   {
      short: string;
      long: string;
   }
> = {
   action: {
      short: 'Action',
      long: 'Action',
   },
   adventure: {
      short: 'Abenteuer',
      long: 'Abenteuer',
   },
   comic: {
      short: 'Komik',
      long: 'Komiks',
   },
   crime: {
      short: 'Krimis',
      long: 'Krimi',
   },
   fantasy: {
      short: 'Fantasy',
      long: 'Fantasy',
   },
   horror: {
      short: 'Horror',
      long: 'Horror',
   },
   romance: {
      short: 'Romantik',
      long: 'Romantik',
   },
};
