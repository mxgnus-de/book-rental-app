import { GENRE_DISPLAYNAMES } from '@book-rental-app/shared/constants';
import { useNotifications } from '@book-rental-app/shared/stores';
import {
	Container,
	GreyBackButton,
	Meta,
	SubHeadline,
} from '@book-rental-app/shared/ui-components';
import { deleteBook, getAllAdminBooks } from '@book-rental-app/shared/utils';
import { AdminBook } from 'libs/shared/types/src/lib/admin';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

interface PageProps {
	books: AdminBook[];
}

const BookAdminPage: NextPage<PageProps> = ({ books: initalBooks }) => {
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const [books, setBooks] = useState<AdminBook[]>(initalBooks);
	const router = useRouter();

	async function handleDeleteBook(book: AdminBook) {
		if (book.isRented) {
			return showErrorNotification(
				`Das Buch "${book.name}" kann nicht gelöscht werden, da es noch ausgeliehen ist.`
			);
		}

		const confirmed = confirm(
			`Möchtest du das Buch "${book.name}" wirklich löschen? Dies kann nicht rückgängig gemacht werden!`
		);

		if (!confirmed) {
			return showSuccessNotification(
				'Die Löschung des Buches wurde abgebrochen.'
			);
		}

		const success = await deleteBook(book.bookId);

		if (success) {
			showSuccessNotification(
				`Das Buch "${book.name}" wurde erfolgreich gelöscht.`
			);
			setBooks((books) => books.filter((b) => b.bookId !== book.bookId));
		} else {
			showErrorNotification(
				`Das Buch "${book.name}" konnte nicht gelöscht werden.`
			);
		}
	}

	return (
		<>
			<Meta title="Bücher Verwaltung" />
			<GreyBackButton onClick={() => router.push('/admin')}>
				Zurück
			</GreyBackButton>
			<Container justifyContent="flex-start" marginTop="3rem">
				<SubHeadline>Bücher verwalten</SubHeadline>
				<Link href="/admin/books/create">
					<span className="button button-green">Buch erstellen</span>
				</Link>
				<BookContainer>
					<Table border={1} frame={true} rules="rows">
						<TableBody>
							<tr>
								<th>Titel</th>
								<th>Autor</th>
								<th>ISBN</th>
								<th>Genre</th>
								<th>Erscheinungsjahr</th>
								<th>Ist ausgeliehen</th>
								<th>Insgesammt ausgeliehen</th>
								<th>Als Favorit markiert</th>
								<th>Actions</th>
							</tr>
							{books
								.sort((a, b) => a.name.localeCompare(b.name))
								.map((book) => {
									const bookCreationDate = new Date(book.publishedAt);

									return (
										<tr key={book.bookId}>
											<td>{book.name}</td>
											<td>{book.author}</td>
											<td>{book.isbn}</td>
											<td>{GENRE_DISPLAYNAMES[book.genre].long}</td>
											<td>{bookCreationDate.getFullYear()}</td>
											<td>{book.isRented ? 'Ja' : 'Nein'}</td>
											<td>{book.totalRentCount || 0}</td>
											<td>{book.favoriteCount || 0}</td>
											<td>
												<Link
													href={`/books/details/${book.bookId}`}
												>
													<span className="button button-blue">
														Anzeigen
													</span>
												</Link>
											</td>
											<td>
												<Link href={`/admin/books/${book.bookId}`}>
													<span className="button button-green">
														Bearbeiten
													</span>
												</Link>
											</td>
											<td>
												<button
													className="button button-red"
													onClick={() =>
														!book.isRented &&
														handleDeleteBook(book)
													}
													style={{
														cursor: book.isRented
															? 'not-allowed'
															: 'pointer',
														opacity: book.isRented ? 0.5 : 1,
													}}
												>
													Löschen
												</button>
											</td>
										</tr>
									);
								})}
						</TableBody>
					</Table>
				</BookContainer>
			</Container>
		</>
	);
};

const BookContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: clamp(300px, 100%, 1200px);
	gap: 1rem;
	padding: 0 1rem;
	margin-top: 2rem;
`;

const Table = styled.table`
	display: flex;
	gap: 1rem;
	padding: 1rem 1.5rem;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.dark};
	width: 100%;
	border-collapse: collapse;
	overflow-x: auto;
`;

const TableBody = styled.tbody`
	td,
	th {
		text-align: center;
		padding: 7.5px 10px;
	}

	th {
		color: #989b9d;
		text-transform: uppercase;
	}

	tr td {
		border-bottom: 1px solid ${({ theme }) => theme.colors.grey.semi};
	}
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

	const books = await getAllAdminBooks(sessionToken);

	return {
		props: {
			books,
		},
	};
};

export default BookAdminPage;
