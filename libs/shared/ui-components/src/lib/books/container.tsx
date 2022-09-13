import { Book as BookType } from '@prisma/client';
import styled from 'styled-components';
import { Book } from './book';

interface BookContainerProps {
	books: BookType[];
}

export function BookContainer({ books }: BookContainerProps) {
	return (
		<Container>
			{books.map((book) => (
				<Book key={book.bookId} book={book} isHovered={false} />
			))}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 3rem;
	max-width: clamp(300px, 100%, 1000px);
	margin: 0 1rem;
`;
