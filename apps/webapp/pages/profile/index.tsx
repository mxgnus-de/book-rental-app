import { UserWithoutPassword } from '@book-rental-app/shared/types';
import {
	BookContainer,
	Container,
	Meta,
	SubHeadline,
} from '@book-rental-app/shared/ui-components';
import {
	getManyBooks,
	getFavoriteBooks,
	getRentedBooks,
	getUser,
} from '@book-rental-app/shared/utils';
import { Book, FavoriteBook, RentedBook } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import styled from 'styled-components';

interface PageProps {
	rentedBooks: RentedBook[];
	favoriteBooks: FavoriteBook[];
	books: Book[];
	user: UserWithoutPassword;
}

const ProfilePage: NextPage<PageProps> = ({
	favoriteBooks,
	rentedBooks,
	books,
}) => {
	return (
		<>
			<Meta title="Dein Profil" />
			<Container marginTop="2rem" justifyContent="flex-start">
				<SubHeadline>Dein Profil</SubHeadline>
				<Content>
					<SmallHeadline>Deine ausgeliehenden Bücher</SmallHeadline>
					{rentedBooks.length ? (
						<BookContainer
							books={rentedBooks
								.map(({ bookId }) =>
									books.find(
										({ bookId: _bookId }) => _bookId === bookId
									)
								)
								.filter((book) => !!book)}
						/>
					) : (
						<p>Du hast derzeit keine Bücher ausgeliehen</p>
					)}
				</Content>
				<Content>
					<SmallHeadline>Deine Favoriten</SmallHeadline>
					{favoriteBooks.length ? (
						<BookContainer
							books={favoriteBooks
								.map(({ bookId }) =>
									books.find(
										({ bookId: _bookId }) => _bookId === bookId
									)
								)
								.filter((book) => !!book)}
						/>
					) : (
						<p>Du hast derzeit keine Bücher ausgeliehen</p>
					)}
				</Content>
			</Container>
		</>
	);
};

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	margin-top: 2rem;
`;

const SmallHeadline = styled.h4`
	font-size: 1.5rem;
	font-weight: 500;
`;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
	req,
}) => {
	const sessionToken = req.cookies.session;

	if (!sessionToken) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	const user = await getUser(sessionToken);

	if (!user) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	const favoriteBooks = (await getFavoriteBooks(sessionToken)) || [];
	const rentedBooks = (await getRentedBooks(sessionToken)) || [];

	const bookIds: string[] = [];

	for (const book of rentedBooks) {
		if (!bookIds.includes(book.bookId)) {
			bookIds.push(book.bookId);
		}
	}

	for (const book of favoriteBooks) {
		if (!bookIds.includes(book.bookId)) {
			bookIds.push(book.bookId);
		}
	}

	const booksMap: Record<string, Book> = {};

	const books = (bookIds.length && (await getManyBooks(bookIds))) || [];

	for (const book of books) {
		booksMap[book.bookId] = book;
	}

	return {
		props: {
			user,
			books,
			favoriteBooks,
			rentedBooks,
		},
	};
};

export default ProfilePage;
