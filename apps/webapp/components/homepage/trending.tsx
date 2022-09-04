import {
	BookSwipeRow,
	SubHeadline,
} from '@book-rental-app/shared/ui-components';
import { Book } from '@prisma/client';
import styled from 'styled-components';

interface TrendingBooksProps {
	trendingBooks: Book[];
}

function TrendingBooks({ trendingBooks }: TrendingBooksProps) {
	return (
		<Wrapper>
			<SubHeadline>Derzeit beliebte Bücher</SubHeadline>
			<BooksWrapper>
				<BookSwipeRow books={trendingBooks} name="trending" />
			</BooksWrapper>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	margin-top: 3rem;
	margin-bottom: 7rem;
	width: 100%;
`;

const BooksWrapper = styled.div`
	width: 100%;
	margin-top: 1.5rem;
`;

export default TrendingBooks;
