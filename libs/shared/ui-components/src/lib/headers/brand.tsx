import Image from 'next/image';
import styled from 'styled-components';
import { Headline, SubHeadline } from '../common';

export function BrandHeader() {
	return (
		<Wrapper>
			<ImageWrapper>
				<Image
					src="/images/header/brand.jpg"
					alt="Header"
					layout="fixed"
					height={525}
					width={1920}
					quality={100}
					priority
				/>
			</ImageWrapper>
			<TextWrapper>
				<StyledHeadline>MMMB</StyledHeadline>
				<StyledSubHeadline>Die Online Bibliothek</StyledSubHeadline>
			</TextWrapper>
		</Wrapper>
	);
}

const Wrapper = styled.div`
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
	margin-bottom: 20px;
`;

const StyledSubHeadline = styled(SubHeadline)`
	font-weight: 500;
	color: #e4e4e4;
`;
