import { BookSwipeRow, SubHeadline } from '@book-rental-app/shared/ui-components';
import { Book } from '@prisma/client';
import styled from 'styled-components';

interface BookGenreProps {
	books: Book[];
	topText: string;
	genre: string;
}

function BookGenre({ books, topText, genre }: BookGenreProps) {
	return (
		<Wrapper>
			<SubHeadline>{topText}</SubHeadline>
			<BooksWrapper>
				<BookSwipeRow books={books} name={genre} />
			</BooksWrapper>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	margin-top: 3rem;
	margin-bottom: 3rem;
	width: 100%;
`;

const BooksWrapper = styled.div`
	width: 100%;
	margin-top: 1.5rem;
`;

export default BookGenre;
