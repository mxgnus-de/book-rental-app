import React from 'react';
import styled, { css } from 'styled-components';

interface HeartProps {
	isClicked: boolean;
	onClick?: () => void;
}

interface HeartComponentProps {
	serviceUrl: string;
	isClicked: boolean;
}

const HeartComponent = styled.div<HeartComponentProps>`
	background-image: url('${({ serviceUrl }) => serviceUrl}/images/heart.png');
	background-repeat: no-repeat;
	cursor: pointer;
	display: inline-block;
	width: 100px;
	height: 100px;
	position: absolute;

	${({ isClicked }) =>
		isClicked &&
		css`
			background-position: -2799px 2px;
			transition: background 1s steps(28);
		`}
`;

const HeartWrapper = styled.div`
	width: 50px;
	height: 50px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export function Heart({ isClicked, onClick }: HeartProps) {
	return (
		<HeartWrapper onClick={onClick}>
			<HeartComponent
				isClicked={isClicked}
				serviceUrl={process.env.NEXT_PUBLIC_SERVICE_URL}
			/>
		</HeartWrapper>
	);
}
