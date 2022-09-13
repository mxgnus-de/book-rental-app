import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export function Footer() {
	return (
		<Wrapper>
			<RightFooter>
				<p>Danke an Nils für das Website Design :)</p>
				<Socials>
					<Link href="https://github.com/mainclasss">
						<FontAwesomeIcon icon={faGithub} size="lg" />
					</Link>
					<Link href="https://www.instagram.com/mainclasss/">
						<FontAwesomeIcon icon={faInstagram} size="lg" />
					</Link>
				</Socials>
			</RightFooter>
			<LeftFooter>
				<p>
					Dieses Projekt wurde in dem Rahmen eines Schul-Informatik
					Projektes erstellt.
				</p>
				<p>
					Es handelt sich dabei um das Thema
					Datenbanken/Datenbankenstruktur (SQL) wobei eine Bibliothek
					widergespiegelt wird.
				</p>
				<p
					style={{
						marginTop: '5px',
					}}
				>
					An diesem Projekt haben folgende Leute mitgewirkt: Max, Bent,
					Mathilda und Magnus
				</p>
				<p
					style={{
						marginTop: '10px',
					}}
				>
					Das Projekt ist open-source und kann auf Github gefunden werden:
				</p>
				<Socials>
					<Link href="https://github.com/mxgnus-de/book-rental-app">
						<FontAwesomeIcon icon={faGithub} size="lg" />
					</Link>
					<Link href="https://dbdiagram.io/d/63149de60911f91ba52fd19e">
						<FontAwesomeIcon icon={faDatabase} size="lg" />
					</Link>
				</Socials>
			</LeftFooter>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	min-height: 100px;
	background-color: ${({ theme }) => theme.colors.grey.dark};
	padding: 2rem 4rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	margin-top: 2rem;
	gap: 2rem;

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		flex-direction: column-reverse;
		padding: 2rem 3rem;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		padding: 2rem 1rem;
	}
`;

const RightFooter = styled.div`
	max-width: 300px;
	text-align: center;

	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;

	p,
	a {
		font-size: 14px;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.md}) {
		gap: 20px;
	}
`;

const LeftFooter = styled(RightFooter)`
	width: 100%;
	max-width: unset;
`;

const Socials = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;

	svg {
		cursor: pointer;
	}

	.fa-github {
		path {
			transition: all 0.3s ease-in-out;
		}

		&:hover {
			path {
				fill: #040204;
			}
		}
	}

	.fa-instagram {
		path {
			transition: all 0.3s ease-in-out;
		}

		&:hover {
			path {
				fill: #2c6a93;
			}
		}
	}

	.fa-database {
		path {
			transition: all 0.3s ease-in-out;
		}

		&:hover {
			path {
				fill: #2c6a93;
			}
		}
	}
`;
