import { Book as BookType } from '@prisma/client';
import styled from 'styled-components';
import { Book } from './book';
import Swiper, { Autoplay } from 'swiper';
import { useEffect, useState } from 'react';

interface BookSwipeRowProps {
	books: BookType[];
	name: string;
}

export function BookSwipeRow({ books, name }: BookSwipeRowProps) {
	const [hoveredBook, setHoveredBook] = useState<string | null>(null);

	useEffect(() => {
		const swiper = new Swiper(`.swiper-${name}`, {
			slidesPerView: 1,
			spaceBetween: 10,
			centeredSlides: true,
			slideToClickedSlide: true,
			loop: true,
			autoplay: {
				delay: 3000,
				pauseOnMouseEnter: true,
				disableOnInteraction: false,
			},
			preventClicksPropagation: false,
			preventClicks: false,
			modules: [Autoplay],
			breakpoints: {
				500: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				700: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				900: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
				1100: {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				1400: {
					slidesPerView: 6,
					spaceBetween: 30,
				},
				1600: {
					slidesPerView: 7,
					spaceBetween: 30,
				},
			},
		});

		return () => {
			swiper.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Wrapper>
			<div
				className={`swiper-${name} swiper`}
				style={{
					width: '100%',
				}}
			>
				<div
					className="swiper-wrapper"
					style={{
						width: '100%',
					}}
				>
					{books.map((book, index) => (
						<div
							key={book.bookId}
							className="swiper-slide"
							onMouseEnter={() =>
								setHoveredBook(`${index}:${book.bookId}`)
							}
							onMouseLeave={() => setHoveredBook(null)}
						>
							<Book
								book={book}
								imagePriority
								isHovered={hoveredBook === `${index}:${book.bookId}`}
							/>
						</div>
					))}
				</div>
			</div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`;

const BookRow = styled.div`
	display: flex;
	gap: 1rem;
	width: 100%;
	overflow-x: scroll;
`;
