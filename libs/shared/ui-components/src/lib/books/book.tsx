import { Book } from '@prisma/client';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

interface BookProps {
	book: Book;
	imagePriority?: boolean;
	isHovered: boolean;
}

interface ElementProps {
	ishovered: boolean;
}

export function Book({ book, imagePriority, isHovered }: BookProps) {
	return (
		<Link href={`/books/details/${book.bookId}`}>
			<Wrapper>
				<TopWrapper>
					<ImageWrapper ishovered={isHovered}>
						<Image
							src={book.cover}
							alt={book.name}
							width={180}
							height={250}
							quality={100}
							priority={imagePriority}
						/>
					</ImageWrapper>
					<DescriptionWrapper ishovered={!!isHovered}>
						<Description>
							{book.description || 'Keine Beschreibung vorhanden :/'}
						</Description>
					</DescriptionWrapper>
				</TopWrapper>
				<Body>
					<Name>{book.name}</Name>
					<Author>{book.author}</Author>
				</Body>
			</Wrapper>
		</Link>
	);
}

const Wrapper = styled.div`
	width: 200px;
	background-color: ${({ theme }) => theme.colors.grey.light};
	border-radius: 20px;
	padding: 10px;
	cursor: pointer;
	height: 370px;
`;

const TopWrapper = styled.div`
	width: 100%;
	position: relative;
`;

const ImageWrapper = styled.div<ElementProps>`
	background-color: ${({ ishovered }) => (ishovered ? '#000' : 'transparent')};
	border-radius: 20px;
	overflow: hidden;

	img {
		transition: all 0.3s ease-in-out;
		border-radius: 20px;
		user-select: none;

		${({ ishovered }) => ishovered && `opacity: 0.2;`}
	}
`;

const DescriptionWrapper = styled.div<ElementProps>`
	transition: all 0.3s ease-in-out;
	visibility: ${({ ishovered }) => (ishovered ? 'visible' : 'hidden')};
	width: 100%;
	position: absolute;
	top: 0;
	bottom: 0;
	overflow: auto;
	height: 250px;
	scrollbar-width: thin;
	padding: 10px;
`;

const Description = styled.p`
	text-align: start;
	font-size: 14px;
`;

const Body = styled.div`
	width: 100%;
	padding: 10px 5px;
	padding-bottom: 15px;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const Name = styled.span`
	text-align: start;
	font-size: 14px;
`;

const Author = styled.span`
	text-align: start;
	font-size: 12px;
`;
