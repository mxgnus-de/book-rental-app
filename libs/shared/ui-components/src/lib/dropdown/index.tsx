import { useState } from 'react';
import styled from 'styled-components';

export interface DropdownItem {
	label: string;
	value: string;
	content: string | JSX.Element;
}

interface DropdownItemProps {
	isOpen: boolean;
}

export function Dropdown({
	items,
	defaultValue,
}: {
	items: DropdownItem[];
	defaultValue?: string;
}) {
	const [open, setOpen] = useState<string | null>(defaultValue ?? null);
	return (
		<Dropdowns>
			{items.map(({ label, content, value }) => (
				<DropdownItem key={value} isOpen={open === value}>
					<DropdownItemTitle
						isOpen={open === value}
						onClick={() => {
							if (open === value) {
								setOpen(null);
							} else {
								setOpen(value);
							}
						}}
					>
						{label}
					</DropdownItemTitle>
					<DropdownItemContent isOpen={open === value}>
						{content}
					</DropdownItemContent>
				</DropdownItem>
			))}
		</Dropdowns>
	);
}

const Dropdowns = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
`;

const DropdownItem = styled.div<DropdownItemProps>`
	width: clamp(300px, 900px, 100%);
	background: ${({ theme }) => theme.colors.grey.light};
	margin-bottom: 0.5rem;
	box-shadow: 0 0.1rem 1rem -0.5rem rgba(0, 0, 0, 0.4);
	border-radius: 5px;
	overflow: hidden;
`;

const DropdownItemTitle = styled.span<DropdownItemProps>`
	padding: 1rem;
	font-size: 1.2rem;
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.grey.dark};
	padding-left: 2.2rem;
	position: relative;
	cursor: pointer;
	user-select: none;
	&::before {
		content: '';
		display: flex;
		align-items: center;
		border-width: 0.4rem;
		border-style: solid;
		border-color: transparent transparent transparent #fff;
		position: absolute;
		left: 1rem;
		transform: rotate(0);
		transform-origin: 0.2rem 50%;
		transition: 0.25s transform ease;
		${({ isOpen }) =>
			isOpen &&
			`
            transform: rotate(90deg);
            `}
	}
`;

const DropdownItemContent = styled.p<DropdownItemProps>`
	display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
	padding: 1rem;
	font-size: 14px;
	text-align: left;
`;
