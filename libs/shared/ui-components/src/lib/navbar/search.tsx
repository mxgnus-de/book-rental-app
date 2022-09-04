import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useRouter } from 'next/router';
import { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { useSearch } from '@book-rental-app/shared/stores';

function Search() {
	const { search, setSearch } = useSearch();
	const router = useRouter();

	function handleKeydown(e: KeyboardEvent<HTMLInputElement>) {
		const key = e.key.toLowerCase();

		if (key === 'enter') {
			searchQuery();
		}
	}

	function searchQuery() {
		router.push(`/search${search ? `?q=${search}` : ''}`);
	}

	return (
		<Wrapper>
			<InputWrapper>
				<Input
					type="text"
					placeholder="Suchen"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={handleKeydown}
				/>
			</InputWrapper>
			<button onClick={searchQuery}>
				<SearchRoundedIcon />
			</button>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	padding: 5px 10px;
	border: 1px solid #fff;
	border-radius: 20px;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		border: none;
	}

	button {
		display: flex;
		justify-content: center;
	}
`;

const InputWrapper = styled.div`
	max-width: 150px;
	padding: 0px 7.5px;
	visibility: visible;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		visibility: hidden;
	}
`;

const Input = styled.input`
	width: 100%;
`;

export default Search;
