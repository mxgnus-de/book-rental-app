import styled from 'styled-components';
import { useUser, useUserUpdate } from '../contexts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserPermission } from '@book-rental-app/shared/utils';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface DropdownProps {
	isopened: number;
}

interface DropdownItemType {
	label: string;
	icon: JSX.Element;
	onAction: () => void;
	invisible?: boolean;
}

function User() {
	const user = useUser();
	const updateUser = useUserUpdate();
	const [dropdownOpened, setDropdownOpened] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (dropdownOpened) {
			setDropdownOpened(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.pathname]);

	if (!user) return null;
	const userPermissions = new UserPermission(user);

	const dropdownItems: DropdownItemType[] = [
		{
			label: 'Profil',
			icon: <AccountCircleRoundedIcon />,
			onAction: () => router.push('/profile'),
		},
		{
			label: 'Admin Panel',
			icon: <AdminPanelSettingsIcon />,
			onAction: () => router.push('/admin'),
			invisible: !userPermissions.hasPermission('ADMIN'),
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

	return (
		<Wrapper>
			<UserWrapper onClick={() => setDropdownOpened((prev) => !prev)}>
				<Username>{user.username}</Username>
				<DropdownIcon isopened={+dropdownOpened} />
			</UserWrapper>
			<DropwdownWrapper isopened={+dropdownOpened}>
				{dropdownItems
					.filter(({ invisible }) => invisible !== true)
					.map(({ label, onAction, icon }) => (
						<DropdownItem
							key={label}
							onClick={() => {
								onAction();
								setDropdownOpened(false);
							}}
						>
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
