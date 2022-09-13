import { useNotifications, useSearch } from '@book-rental-app/shared/stores';
import {
	Book,
	Container,
	Meta,
	SubHeadline,
	WrappedLoadingSpinner,
} from '@book-rental-app/shared/ui-components';
import { NextPage } from 'next';
import styled from 'styled-components';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { KeyboardEvent, useEffect, useState } from 'react';
import { Book as BookType } from '@prisma/client';
import { useRouter } from 'next/router';
import { getBookSearchResults } from '@book-rental-app/shared/utils';

const SearchPage: NextPage = () => {
	const { search, setSearch } = useSearch();
	const [searchResults, setSearchResults] = useState<BookType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { showErrorNotification } = useNotifications();
	const router = useRouter();

	async function executeSearch() {
		if (!search) return setSearchResults([]);

		setIsLoading(true);
		const results = await getBookSearchResults(search);

		if (!results) {
			setIsLoading(false);
			showErrorNotification(
				'Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
			);
			return;
		}

		setIsLoading(false);
		setSearchResults(results.results);
	}

	function handleKeydown(e: KeyboardEvent<HTMLInputElement>) {
		const key = e.key.toLowerCase();

		if (key === 'enter') {
			executeSearch();
		}
	}

	useEffect(() => {
		const { q } = router.query;

		if (q && typeof q === 'string') {
			setSearch(q);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			router.replace({
				...router,
				query: {
					...router.query,
					q: search,
				},
			});
			executeSearch();
		}, 400);

		return () => clearTimeout(timeout);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	return (
		<>
			<Meta title="Suche" />
			<Container marginTop="2rem" justifyContent="flex-start">
				<SubHeadline>Suchen</SubHeadline>
				<SearchWrapper>
					<SearchInputWrapper>
						<SearchInput
							type="text"
							placeholder="Suchen"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={handleKeydown}
						/>
					</SearchInputWrapper>
					<button onClick={executeSearch}>
						<SearchRoundedIcon />
					</button>
				</SearchWrapper>
				{isLoading ? (
					<WrappedLoadingSpinner />
				) : searchResults.length ? (
					<SearchResultsWrapper>
						{searchResults.map((book) => (
							<Book book={book} isHovered={false} key={book.bookId} />
						))}
					</SearchResultsWrapper>
				) : (
					<p>Keine Ergebnisse gefunden</p>
				)}
			</Container>
		</>
	);
};

const SearchWrapper = styled.div`
	padding: 5px 10px;
	border: 1px solid #fff;
	border-radius: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 1.5rem;

	button {
		display: flex;
		justify-content: center;
	}
`;

const SearchInputWrapper = styled.div`
	padding: 5px 15px;
`;

const SearchInput = styled.input`
	width: 250px;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		width: 200px;
	}
`;

const SearchResultsWrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-gap: 20px;
	max-width: clamp(300px, 100%, 1100px);
	margin-bottom: 2rem;
	align-items: center;
	justify-items: center;
	padding: 10px 20px;
`;

export default SearchPage;
