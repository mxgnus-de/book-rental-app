import { GENRE_DISPLAYNAMES } from '@book-rental-app/shared/constants';
import { useNotifications } from '@book-rental-app/shared/stores';
import {
	Container,
	Dropdown,
	DropdownItem,
	GreyBackButton,
	Heart,
	Meta,
	SubHeadline,
	useUser,
	WrappedLoadingSpinner,
} from '@book-rental-app/shared/ui-components';
import {
	addFavoriteBook,
	getBook,
	getManyBooks,
	removeFavoriteBook,
	rentBook as rentBookRequest,
	returnRentedBook,
} from '@book-rental-app/shared/utils';
import { Book } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface PageProps {
	book: Book;
	bookId: string;
}

type RentedStatus = 'NOT_RENTED' | 'RENTED' | 'RENTED_BY_USER' | 'LOADING';

interface RentButtonProps {
	rentedStatus: RentedStatus;
}

const BookDetailsPage: NextPage<PageProps> = ({ book: initalBook, bookId }) => {
	const [book, setBook] = useState<Book>(initalBook);
	const [isFavorite, setIsFavorite] = useState(false);
	const [rentedStatus, setRentedStatus] = useState<RentedStatus>('LOADING');
	const { showSuccessNotification, showErrorNotification } =
		useNotifications();
	const router = useRouter();
	const user = useUser();

	const dropdownItems: DropdownItem[] = [
		{
			label: 'Beschreibung',
			value: 'description',
			content:
				book.description ?? 'Es ist leider keine Beschreibung vorhanden :(',
		},
		{
			label: 'Genre',
			value: 'genre',
			content: GENRE_DISPLAYNAMES[book.genre].long ?? 'Unbekannt',
		},
		{
			label: 'Autor',
			value: 'author',
			content: book.author,
		},
		{
			label: 'Erscheinungsjahr',
			value: 'published',
			content: new Date(book.publishedAt).getFullYear().toString(),
		},
		{
			label: 'ISBN',
			value: 'isbn',
			content: book.isbn,
		},
	];

	useEffect(() => {
		const getBookDetails = () =>
			getBook(bookId).then((bookDetails) => {
				if (!bookDetails) return;
				const { book, isFavorite, isRented } = bookDetails;

				setBook(book);
				setIsFavorite(isFavorite);

				if (typeof isRented === 'boolean') {
					setRentedStatus(isRented ? 'RENTED' : 'NOT_RENTED');
				} else if (typeof isRented === 'object') {
					setRentedStatus('RENTED_BY_USER');
				}
			});

		getBookDetails();

		const interval = setInterval(getBookDetails, 1000 * 20);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function changeFavoriteStatus(state: boolean) {
		if (!user) return router.push('/login');

		if (state) {
			const newState = await addFavoriteBook(bookId);
			setIsFavorite(newState ?? true);
			showSuccessNotification('Buch erfolgreich zu Favoriten hinzugefügt');
		} else {
			const newState = await removeFavoriteBook(bookId);
			setIsFavorite(newState ?? false);
			showSuccessNotification('Buch erfolgreich aus Favoriten entfernt');
		}
	}

	async function rentBook() {
		const rentedBook = await rentBookRequest(bookId);

		if (!rentedBook || typeof rentedBook.success !== 'boolean') {
			return showErrorNotification(
				'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
			);
		} else if (rentedBook.success === false) {
			setRentedStatus(
				rentedBook.error === 'ALREADY_RENTED'
					? 'RENTED'
					: rentedBook.error === 'ALREADY_RENTED_BY_USER'
					? 'RENTED_BY_USER'
					: 'NOT_RENTED'
			);
			return showErrorNotification(
				rentedBook.error === 'NOT_FOUND'
					? 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
					: rentedBook.error === 'ALREADY_RENTED'
					? 'Das Buch ist bereits ausgeliehen'
					: rentedBook.error === 'ALREADY_RENTED_BY_USER'
					? 'Du hast das Buch bereits ausgeliehen'
					: rentedBook.error === 'TOO_MANY_RENTED_BOOKS'
					? 'Du hast bereits zu viele Bücher ausgeliehen'
					: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
			);
		} else {
			showSuccessNotification('Buch erfolgreich ausgeliehen');
			setRentedStatus('RENTED_BY_USER');
		}
	}

	async function returnBook() {
		const returnedBook = await returnRentedBook(bookId);

		if (!returnedBook || typeof returnedBook.success !== 'boolean') {
			return showErrorNotification(
				'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
			);
		} else if (returnedBook.success === false) {
			return showErrorNotification(
				returnedBook.error === 'NOT_FOUND'
					? 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
					: returnedBook.error === 'NOT_RENTED'
					? 'Das Buch ist nicht ausgeliehen'
					: returnedBook.error === 'NOT_RENTED_BY_USER'
					? 'Du hast das Buch nicht ausgeliehen'
					: 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
			);
		} else {
			showSuccessNotification('Buch erfolgreich zurückgegeben');
			setRentedStatus('NOT_RENTED');
		}
	}

	return (
		<>
			<Meta
				title={book.name}
				description={
					book.description ||
					'Es ist keine Beschreibung für dieses Buch vorhanden :('
				}
			/>
			<GreyBackButton onClick={() => router.back()}>Zurück</GreyBackButton>
			<BookContainer justifyContent="flex-start">
				<SubHeadline>{book.name}</SubHeadline>
				<BookWrapper>
					<BookContent>
						<Dropdown items={dropdownItems} defaultValue="description" />
						<BookInteractionWrapper>
							<RentButton
								rentedStatus={rentedStatus}
								onClick={() => {
									if (rentedStatus === 'NOT_RENTED') {
										if (!user) return router.push('/login');
										rentBook();
									} else if (rentedStatus === 'RENTED_BY_USER')
										returnBook();
								}}
							>
								{rentedStatus === 'LOADING' ? (
									<WrappedLoadingSpinner size={20} />
								) : rentedStatus === 'RENTED_BY_USER' ? (
									'Zurückgeben'
								) : rentedStatus === 'RENTED' ? (
									'Bereits ausgeliehen'
								) : (
									'Ausleihen'
								)}
							</RentButton>
							<Heart
								isClicked={isFavorite}
								onClick={() => changeFavoriteStatus(!isFavorite)}
							/>
						</BookInteractionWrapper>
					</BookContent>
					<BookImage>
						<Image
							src={book.cover}
							alt={book.name}
							width={360}
							height={500}
						/>
					</BookImage>
				</BookWrapper>
			</BookContainer>
		</>
	);
};

const BookContainer = styled(Container)`
	max-width: clamp(300px, 100%, 1300px);
	padding: 2rem 1rem;
`;

const BookWrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	gap: 2rem;
	margin-top: 2rem;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		flex-direction: column-reverse;
	}
`;

const BookContent = styled.div`
	width: 100%;
`;

const BookInteractionWrapper = styled.div`
	display: flex;
	gap: 1.5rem;
	margin-top: 10px;
	align-items: center;
`;

const RentButton = styled.button<RentButtonProps>`
	padding: 0.5rem 2rem;
	border-radius: 20px;
	background-color: ${({ theme }) => theme.colors.grey.light};
	cursor: ${({ rentedStatus }) =>
		rentedStatus === 'NOT_RENTED' || rentedStatus === 'RENTED_BY_USER'
			? 'pointer'
			: 'not-allowed'};
`;

const BookImage = styled.div`
	img {
		border-radius: 20px;
	}
`;

export const getStaticPaths: GetStaticPaths = async () => {
	const books = (await getManyBooks()) || [];

	return {
		paths: books.map(({ bookId }) => ({
			params: { bookId },
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
	const { bookId } = params as {
		bookId: string;
	};

	const bookDetails = await getBook(bookId);

	if (!bookDetails)
		return {
			notFound: true,
		};

	return {
		props: {
			book: bookDetails.book,
			bookId,
		},
		revalidate: 60 * 60,
	};
};

export default BookDetailsPage;
