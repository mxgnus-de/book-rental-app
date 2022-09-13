import {
	Container,
	Meta,
	SubHeadline,
	useUser,
} from '@book-rental-app/shared/ui-components';
import {
	faArrowRight,
	faBook,
	faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import Link from 'next/link';
import Twemoji from 'react-twemoji';
import styled from 'styled-components';

interface ActionItemType {
	label: string;
	icon: JSX.Element;
	href: string;
}

const AdminHomepage: NextPage = () => {
	const user = useUser();

	const actionItems: ActionItemType[] = [
		{
			label: 'Benutzer verwalten',
			icon: <FontAwesomeIcon icon={faUsersGear} />,
			href: '/admin/users',
		},
		{
			label: 'Bücher verwalten',
			icon: <FontAwesomeIcon icon={faBook} />,
			href: '/admin/books',
		},
	];

	return (
		<>
			<Meta title="Admin Homepage" />
			<Container justifyContent="flex-start" marginTop="3rem">
				<Headline>
					<span>
						Willkommen im Adminpanel {user && <>{user.username}!</>}
					</span>
					<Twemoji>
						<span>👋</span>
					</Twemoji>
				</Headline>
				<ActionsWrapper>
					<ActionsHeadline>Was möchtest du tun?</ActionsHeadline>
					<Actions>
						{actionItems.map(({ label, icon, href }) => (
							<Link key={label} href={href}>
								<ActionItem>
									<ActionItemContent>
										<ActionItemIconWrapper>
											{icon}
										</ActionItemIconWrapper>
										<ActionItemLabel>{label}</ActionItemLabel>
									</ActionItemContent>
									<FontAwesomeIcon icon={faArrowRight} />
								</ActionItem>
							</Link>
						))}
					</Actions>
				</ActionsWrapper>
			</Container>
		</>
	);
};

const Headline = styled(SubHeadline)`
	display: flex;
	gap: 10px;
	justify-content: center;
	align-items: center;

	@media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
		flex-direction: column;
	}
`;

const ActionsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: clamp(250px, 100%, 550px);
	margin-top: 4rem;
	gap: 2rem;
`;

const ActionsHeadline = styled.h6`
	font-size: 1.5rem;
	font-weight: 500;
	border-bottom: 3px solid ${({ theme }) => theme.colors.grey.light};
	padding: 0 10px;
	padding-bottom: 2.5px;
`;

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	padding: 0 10px;
`;

const ActionItem = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	cursor: pointer;
	padding: 1rem 1.5rem;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.dark};
`;

const ActionItemContent = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

const ActionItemIconWrapper = styled.div`
	font-size: 20px;
`;

const ActionItemLabel = styled.span`
	user-select: none;
	font-size: 1.1rem;
`;

export default AdminHomepage;
