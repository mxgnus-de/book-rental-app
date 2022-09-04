import styled from 'styled-email-components';

export const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const A = styled.a`
	color: #2fb4ff;
	transition: all 0.3s ease-in-out;
	text-decoration: none;
`;

export const P = styled.p``;

export const Button = styled.button`
	padding: 15px 30px;
	background-color: #2fb4ff;
	color: #fff;
	width: fit-content;
	border-radius: 20px;
	text-decoration: none;
`;

export function Header() {
	return (
		<>
			<HeaderWrapper>
				<img
					src={`${process.env.NEXT_PUBLIC_SERVICE_URL}/_next/image?url=/images%2Flogos%2Flogo.png&w=48&q=100`}
					alt="logo"
				/>
				<A
					style={{
						fontSize: '20px',
						fontWeight: 'bold',
					}}
					href={`${process.env.NEXT_PUBLIC_SERVICE_URL}`}
				>
					Book-Rental App
				</A>
			</HeaderWrapper>
			<Hyphen />
		</>
	);
}

const HeaderWrapper = styled.div`
	display: flex;
	gap: 20px;
	align-items: center;
`;

const Hyphen = styled.div`
	width: 100%;
	height: 2px;
	border-radius: 2px;
	background-color: #eee;
`;
