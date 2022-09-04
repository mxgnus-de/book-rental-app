import Image from 'next/image';
import styled from 'styled-components';
import { Headline } from '../common';
import { BlueLine } from '../line';

export function BrowseHeader() {
	return (
		<Wrapper>
			<BlueLine />
			<Container>
				<ImageWrapper>
					<Image
						src="/images/book.png"
						alt="Header"
						layout="fixed"
						height={525}
						width={1920}
						quality={100}
					/>
				</ImageWrapper>
				<TextWrapper>
					<StyledHeadline>Stöbern</StyledHeadline>
				</TextWrapper>
			</Container>
			<BlueLine />
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
`;

const Container = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 525px;
`;

const ImageWrapper = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;

	background-color: ${({ theme }) => theme.colors.blue.light};
	position: absolute;

	img {
		object-fit: cover;
		object-position: center;
		opacity: 0.7;
		filter: blur(0.9px);
	}
`;

const TextWrapper = styled.div`
	z-index: 10;
`;

const StyledHeadline = styled(Headline)`
	font-family: ${({ theme }) => theme.fonts.primary};
`;
