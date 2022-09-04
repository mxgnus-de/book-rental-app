import styled from 'styled-components';
import { useUser } from '../contexts';
import Login from './login';
import Image from 'next/image';
import Link from 'next/link';
import User from './user';
import Search from './search';

function Navbar() {
	const user = useUser();

	return (
		<Wrapper>
			<NavContent>
				<LeftNav>
					<Link href="/">
						<LogoButton>
							<Image
								src="/images/logos/logo.png"
								width={42}
								height={42}
								quality={100}
							/>
						</LogoButton>
					</Link>
				</LeftNav>
				<RightNav>
					<Search />
					{user ? <User /> : <Login />}
				</RightNav>
			</NavContent>
		</Wrapper>
	);
}

const Wrapper = styled.nav`
	width: 100%;
	height: 100%;
	min-height: 50px;
	background-color: ${({ theme }) => theme.colors.blue.light};
`;

const NavContent = styled.div`
	height: 100%;
	width: 100%;
	padding: 7.5px 30px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		padding: 7.5px 15px;
	}
`;

const LeftNav = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 20px;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		gap: 10px;
	}
`;

const LogoButton = styled.div`
	cursor: pointer;
`;

const RightNav = styled(LeftNav)`
	justify-content: flex-end;
`;

export { Navbar };
