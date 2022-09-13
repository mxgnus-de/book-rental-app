import { Book } from '@prisma/client';

export type AdminBook = Book & {
	isRented: boolean;
	favoriteCount: number;
	totalRentCount: number;
};
