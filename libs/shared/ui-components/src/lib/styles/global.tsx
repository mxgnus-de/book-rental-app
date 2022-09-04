import * as styled from 'styled-components';

export const GlobalDefaultStyle = styled.createGlobalStyle`
	* {
		box-sizing: border-box;
		color: #fff;
		margin: 0;
		padding: 0;
		font-family: ${({ theme }) => theme.fonts.primary}, sans-serif;
	}

	body {
		margin: 0;
		padding: 0;
		background-color: ${({ theme }) => theme.colors.grey.semi};
	}

	html,
	body {
		min-height: 100vh;
		overflow-x: hidden;
	}

	#__next {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.blue {
		color: #0090d9;
	}

	.pointer {
		cursor: pointer;
	}

	li {
		list-style: none;
	}

	a {
		text-decoration: none;
		color: ${({ theme }) => theme.colors.blue.light};
		cursor: pointer;
		font-size: 1rem;
		transition: 300ms ease-in-out;

		&:hover {
			color: ${({ theme }) => theme.colors.blue.dark};
		}
	}

	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
		font-size: 1rem;
		button:focus {
			outline: none;
		}
	}

	input {
		border: none;
		background-color: transparent;
	}

	input:focus {
		outline: none;
	}

	select {
		border: none;
		background-color: transparent;
	}

	select:focus {
		outline: none;
	}

	textarea {
		border: none;
		overflow: auto;
		outline: none;
		resize: none;
	}

	.button {
		height: auto;
		width: auto;
		padding: 10px;
		border-radius: 10px;
		cursor: pointer;
		border: none;
		min-width: 3rem;
		&-white {
			background-color: #000;
			color: #fff;
		}

		&-red {
			background-color: #a01c29;
			color: #e8e6e3;
		}

		&-green {
			background-color: #1a6d2d;
			color: #e8e6e3;
			border: 1px solid #28a845;
		}

		&-yellow {
			background-color: #fff000;
			color: #000000;
		}

		&-blue {
			background-color: #0054ae;
			color: #fff;
		}

		&-grey {
			background-color: #333232;
			color: #fff;
		}
	}

	:-webkit-autofill {
		filter: none;
		box-shadow: 0 0 0 100px ${({ theme }) => theme.colors.grey.light} inset;
	}

	.swiper-slide {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
`;
