import styled from 'styled-components';
import { useUser, useUserUpdate } from '../contexts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

interface DropdownProps {
	isopened: number;
}

interface DropdownItemType {
	label: string;
	icon: JSX.Element;
	onAction: () => void;
}

function User() {
	const user = useUser();
	const updateUser = useUserUpdate();
	const [dropdownOpened, setDropdownOpened] = useState(false);
	const router = useRouter();

	const dropdownItems: DropdownItemType[] = [
		{
			label: 'Profil',
			icon: <AccountCircleRoundedIcon />,
			onAction: () => router.push('/profile'),
		},
		{
			label: 'Einstellungen',
			icon: <SettingsIcon />,
			onAction: () => router.push('/profile/settings'),
		},
		{
			label: 'Ausloggen',
			icon: <LogoutIcon />,
			onAction: () => updateUser.logout(),
		},
	];

	if (!user) return null;

	return (
		<Wrapper>
			<UserWrapper onClick={() => setDropdownOpened((prev) => !prev)}>
				<Username>{user.username}</Username>
				<DropdownIcon isopened={+dropdownOpened} />
			</UserWrapper>
			<DropwdownWrapper isopened={+dropdownOpened}>
				{dropdownItems.map(({ label, onAction, icon }) => (
					<DropdownItem key={label} onClick={onAction}>
						{icon}
						<span>{label}</span>
					</DropdownItem>
				))}
			</DropwdownWrapper>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	gap: 5px;
	user-select: none;
	position: relative;
`;

const UserWrapper = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Username = styled.span``;

const DropdownIcon = styled(ArrowDropDownIcon)<DropdownProps>`
	transition: all 0.3s ease-in-out;
	transform: rotate(${({ isopened }) => (isopened ? '180deg' : '0deg')});
`;

const DropwdownWrapper = styled.div<DropdownProps>`
	transition: all 0.3s ease-in-out;
	position: absolute;
	visibility: ${({ isopened }) => (isopened ? 'visible' : 'hidden')};
	opacity: ${({ isopened }) => (isopened ? '1' : '0')};
	transform: translateY(${({ isopened }) => (isopened ? '0' : '-100px')});
	top: 50px;
	right: 0;
	z-index: 100;
	padding: 15px 20px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.light};
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const DropdownItem = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border-bottom: 2px solid ${({ theme }) => theme.colors.grey.dark};
	gap: 10px;
	padding-bottom: 5px;

	svg {
		width: 25px;
		height: 25px;
	}
`;

export default User;
