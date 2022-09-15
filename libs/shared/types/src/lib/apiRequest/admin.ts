import { Book } from '@prisma/client';
import { ApiRequest } from '.';

export type AdminUpdateBookApiRequest = ApiRequest<
	{
		bookId: string;
	} & Omit<Omit<Partial<Book>, 'createdAt'>, 'bookId'>
>;

export type AdminCreateBookApiRequest = ApiRequest<
	Omit<Omit<Omit<Book, 'bookId'>, 'createdAt'>, 'cover'> & {
		cover?: string;
	}
>;
