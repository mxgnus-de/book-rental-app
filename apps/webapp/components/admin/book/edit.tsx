import { GENRE_DISPLAYNAMES } from '@book-rental-app/shared/constants';
import { useNotifications } from '@book-rental-app/shared/stores';
import {
	AdminBookCoverUpdateApiResponse,
	AdminCreateBookApiRequest,
	AdminUpdateBookApiRequest,
} from '@book-rental-app/shared/types';
import {
	Container,
	GreyBackButton,
	Meta,
	SubHeadline,
} from '@book-rental-app/shared/ui-components';
import { Book, BookGenre } from '@prisma/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	updateBook as updateBookApi,
	createBook as createBookApi,
	deleteBook as deleteBookApi,
	apiClient,
} from '@book-rental-app/shared/utils';
import { useRouter } from 'next/router';

type EditBookProps =
	| {
			mode: 'edit';
			book: Book;
	  }
	| {
			mode: 'create';
			book?: Partial<Book>;
	  };

interface InputLabelProps {
	required?: boolean;
}

function EditBook({ book: initalBook, mode }: EditBookProps) {
	const [book, setBook] = useState<Partial<Book>>({
		...initalBook,
	});
	const [newCoverImage, setNewCoverImage] = useState<File | null>(null);
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const router = useRouter();

	useEffect(() => {
		if (mode === 'create') {
			setBook((book) => ({
				...book,
				publishedAt: new Date(),
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function updateBook() {
		if (mode !== 'edit') return;

		const payload: AdminUpdateBookApiRequest = {
			bookId: initalBook.bookId,
			author: book.author,
			genre: book.genre,
			isbn: book.isbn,
			cover: book.cover,
			description: book.description || null,
			name: book.name,
			publishedAt: book.publishedAt,
		};

		const success = await updateBookApi(initalBook.bookId, payload);

		if (!success) {
			return showErrorNotification(
				'Es ist ein Fehler aufgetreten. Das Buch konnte nicht aktualisiert werden.'
			);
		}

		if (newCoverImage !== null) {
			const newCover = await changeBookCover(
				initalBook.bookId,
				newCoverImage
			);

			if (!newCover) {
				return showErrorNotification(
					'Es ist ein Fehler aufgetreten. Das Buch Cover konnte nicht aktualisiert werden.'
				);
			}

			setBook((book) => ({
				...book,
				cover: newCover,
			}));

			setNewCoverImage(null);
		}

		showSuccessNotification('Das Buch wurde erfolgreich aktualisiert.');
	}

	async function createBook() {
		if (mode !== 'create') return;

		if (
			!book.name ||
			!book.author ||
			!book.genre ||
			!book.isbn ||
			!book.publishedAt ||
			!newCoverImage ||
			book.genre === ('default' as any)
		) {
			return showErrorNotification('Bitte fülle alle Felder aus.');
		}

		const payload: AdminCreateBookApiRequest = {
			author: book.author,
			genre: book.genre,
			description: book.description || null,
			isbn: book.isbn,
			name: book.name,
			publishedAt: book.publishedAt,
		};

		const newBookId = await createBookApi(payload);

		if (!newBookId) {
			return showErrorNotification(
				'Es ist ein Fehler aufgetreten. Das Buch konnte nicht erstellt werden.'
			);
		}

		const newCover = await changeBookCover(newBookId, newCoverImage);

		if (!newCover) {
			return showErrorNotification(
				'Es ist ein Fehler aufgetreten. Das Buch Cover konnte nicht aktualisiert werden.'
			);
		}

		showSuccessNotification('Das Buch wurde erfolgreich erstellt.');
		router.push('/admin/books');
	}

	async function deleteBook() {
		if (mode !== 'edit') return;

		const confirmed = confirm('Möchtest du das Buch wirklich löschen?');

		if (!confirmed) {
			return showSuccessNotification(
				'Die Löschung des Buches wurde erfolgreich abgebrochen.'
			);
		}

		const success = await deleteBookApi(initalBook.bookId);

		if (success) {
			showSuccessNotification('Das Buch wurde erfolgreich gelöscht.');
			router.push('/admin/books');
		} else {
			showErrorNotification(
				'Es ist ein Fehler aufgetreten. Das Buch konnte nicht gelöscht werden.'
			);
		}
	}

	async function changeBookCover(bookId: string, cover: File) {
		try {
			const formData = new FormData();
			formData.append('cover', cover);

			const response = await apiClient.post<AdminBookCoverUpdateApiResponse>(
				`/admin/books/${bookId}/cover`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			return response.data.coverUrl;
		} catch (err) {
			return null;
		}
	}

	return (
		<>
			<Meta
				title={
					mode === 'edit'
						? `Buch bearbeiten • ${initalBook.name}`
						: 'Buch erstellen'
				}
			/>
			<GreyBackButton onClick={() => router.push('/admin/books')}>
				Zurück
			</GreyBackButton>
			<Container justifyContent="flex-start" marginTop="3rem">
				<SubHeadline>
					{mode === 'edit'
						? `Buch bearbeiten • ${initalBook.name}`
						: 'Buch erstellen'}
				</SubHeadline>
				<EditorWrapper>
					<EditorItem>
						<InputWrapper>
							<InputLabel required>Buchtitel</InputLabel>
							<Input
								value={book.name}
								type="text"
								onChange={(e) =>
									e.target.value.length <= 100 &&
									setBook({ ...book, name: e.target.value })
								}
							/>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel required>Buch Autor</InputLabel>
							<Input
								value={book.author}
								type="text"
								onChange={(e) =>
									e.target.value.length <= 100 &&
									setBook({ ...book, author: e.target.value })
								}
							/>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel required={mode === 'create'}>
								Buch Cover
							</InputLabel>
							<FileInput
								value={undefined}
								type="file"
								accept="image/png, image/jpeg, image/jpg"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (!file) return setNewCoverImage(null);
									const fileSizeInKB = Math.round(file.size / 1024);

									if (!file.type.includes('image'))
										return setNewCoverImage(null);
									else if (fileSizeInKB > 2048) {
										showErrorNotification(
											'Das Ausgewählte Bild ist zu groß. Bitte wähle ein Bild mit einer Größe von unter 2MB aus.'
										);
										return setNewCoverImage(null);
									}

									setNewCoverImage(file);
								}}
							/>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel required>Buch ISBN</InputLabel>
							<Input
								value={book.isbn}
								type="text"
								onChange={(e) =>
									e.target.value.length <= 50 &&
									setBook({ ...book, isbn: e.target.value })
								}
							/>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel required>Buch Erscheinungsjahr</InputLabel>
							<Input
								value={
									new Date(book.publishedAt).getFullYear() ||
									new Date().getFullYear()
								}
								type="number"
								inputMode="numeric"
								onChange={(e) => {
									const date = new Date(e.target.value);
									if (
										isNaN(date?.getTime()) ||
										date.getFullYear() > new Date().getFullYear()
									)
										return;

									e.target.value.length <= 50 &&
										setBook({
											...book,
											publishedAt: new Date(e.target.value),
										});
								}}
							/>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel required>Buch Genre</InputLabel>
							<Select
								onChange={(e) => {
									setBook({
										...book,
										genre: e.target.value as BookGenre,
									});
								}}
								defaultValue={book.genre || 'default'}
							>
								<>
									<option disabled value="default">
										--- Bitte auswählen ---
									</option>
									{Object.values(BookGenre).map((genre) => (
										<option key={genre} value={genre}>
											{GENRE_DISPLAYNAMES[genre as BookGenre].long}
										</option>
									))}
								</>
							</Select>
						</InputWrapper>
					</EditorItem>
					<EditorItem>
						<InputWrapper>
							<InputLabel>Buch Beschreibung</InputLabel>
							<Textarea
								value={book.description || ''}
								onChange={(e) =>
									e.target.value.length <= 1000 &&
									setBook({
										...book,
										description: e.target.value || null,
									})
								}
							/>
						</InputWrapper>
					</EditorItem>
				</EditorWrapper>
				<ActionButtonWrapper>
					<button
						className="button button-green"
						onClick={() => {
							if (mode === 'edit') {
								updateBook();
							} else {
								createBook();
							}
						}}
					>
						{mode === 'edit' ? 'Speichern' : 'Erstellen'}
					</button>
					{mode === 'edit' && (
						<button
							className="button button-blue"
							onClick={() =>
								router.push(`/books/details/${initalBook.bookId}`)
							}
						>
							Anzeigen
						</button>
					)}
					{mode === 'edit' && (
						<button
							className="button button-red"
							onClick={() => deleteBook()}
						>
							Löschen
						</button>
					)}
				</ActionButtonWrapper>
			</Container>
		</>
	);
}

const EditorWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 2rem;
	width: clamp(300px, 100%, 700px);
`;

const EditorItem = styled.div`
	display: flex;
	flex-direction: column;
`;

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;
	gap: 5px;
`;

export const InputLabel = styled.label<InputLabelProps>`
	font-size: 0.9rem;
	font-weight: normal;

	&::after {
		content: '${({ required }) => (required ? '*' : '')}';
		color: #ff0000;
		margin-left: 5px;
		font-size: 16px;
	}
`;

export const Input = styled.input`
	width: 100%;
	height: 40px;
	padding: 2.5px 10px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.light};
`;

export const FileInput = styled(Input)`
	height: unset;
	padding: 12.5px 10px;
`;

const Textarea = styled.textarea`
	width: 100%;
	height: 150px;
	padding: 15px 20px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.light};
	resize: none;
`;

const Select = styled.select`
	width: 100%;
	height: 40px;
	padding: 2.5px 10px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.light};
`;

const ActionButtonWrapper = styled.div`
	margin-top: 2rem;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

export default EditBook;
