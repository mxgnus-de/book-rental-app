import styled from 'styled-components';

export const Headline = styled.h1`
	font-size: 5.25rem;
	font-weight: bolder;
	font-family: ${({ theme }) => theme.fonts.poppins};
	word-wrap: break-word;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		font-size: 5rem;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		font-size: 4.5rem;
	}
`;

export const SubHeadline = styled.h2`
	font-size: 3.5rem;
	font-weight: normal;
	font-family: ${({ theme }) => theme.fonts.poppins};
	word-wrap: break-word;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		font-size: 2.5rem;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		font-size: 2rem;
	}
`;
