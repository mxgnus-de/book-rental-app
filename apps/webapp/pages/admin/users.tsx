import { useNotifications } from '@book-rental-app/shared/stores';
import { UserWithoutPassword } from '@book-rental-app/shared/types';
import {
	Container,
	GreyBackButton,
	Meta,
	SubHeadline,
	useUser,
} from '@book-rental-app/shared/ui-components';
import {
	activateUser,
	deactivateUser,
	getUsers,
	UserPermission,
} from '@book-rental-app/shared/utils';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';

interface PageProps {
	users: UserWithoutPassword[];
}

const UserAdminPage: NextPage<PageProps> = ({ users: initalUsers }) => {
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const [users, setUsers] = useState<UserWithoutPassword[]>(initalUsers);
	const user = useUser();
	const router = useRouter();

	async function handleDeactivateUser(user: UserWithoutPassword) {
		const success = await deactivateUser(user.userId);

		if (success) {
			setUsers((users) =>
				users.map((_user) => {
					if (_user.userId === user.userId) {
						return { ..._user, isDeactivated: true };
					} else {
						return _user;
					}
				})
			);
			showSuccessNotification(
				`Der Account von ${user.username} wurde erfolgreich deaktiviert`
			);
		} else {
			showErrorNotification(
				`Der Account von ${user.username} konnte nicht deaktiviert werden`
			);
		}
	}

	async function handleActivateUser(user: UserWithoutPassword) {
		const success = await activateUser(user.userId);

		if (success) {
			setUsers((users) =>
				users.map((_user) => {
					if (_user.userId === user.userId) {
						return { ..._user, isDeactivated: false };
					} else {
						return _user;
					}
				})
			);
			showSuccessNotification(
				`Der Account von ${user.username} wurde erfolgreich aktiviert`
			);
		} else {
			showErrorNotification(
				`Der Account von ${user.username} konnte nicht aktiviert werden`
			);
		}
	}

	return (
		<>
			<Meta title="Benutzer Verwaltung" />
			<GreyBackButton onClick={() => router.push('/admin')}>
				Zurück
			</GreyBackButton>
			<Container justifyContent="flex-start" marginTop="3rem">
				<SubHeadline>Benutzer verwalten</SubHeadline>
				<UsersContainer>
					<Table border={1} frame={true} rules="rows">
						<TableBody>
							<tr>
								<th>Benutzername</th>
								<th>Name</th>
								<th>E-Mail</th>
								<th>Permissions</th>
								<th>Ist verifiziert</th>
								<th>Ist deaktiviert</th>
								<th>Aktionen</th>
							</tr>
							{users
								.sort((a, b) => a.username.localeCompare(b.username))
								.map((_user) => {
									const userPermissions = new UserPermission(_user);
									const isAdmin =
										userPermissions.hasPermission('ADMIN');

									return (
										<tr key={_user.userId}>
											<td>
												{_user.username}{' '}
												{_user.userId === user?.userId && (
													<IsMe>Du</IsMe>
												)}
											</td>
											<td>
												{_user.surname} {_user.lastname}
											</td>
											<td>{_user.email}</td>
											<td>
												{_user.permissions.split(';').join(', ')}
											</td>
											<td>{_user.isVerified ? 'Ja' : 'Nein'}</td>
											<td>{_user.isDeactivated ? 'Ja' : 'Nein'}</td>
											<td>
												<button
													className={`button button-${
														_user.isDeactivated ? 'green' : 'red'
													}`}
													style={{
														opacity: isAdmin ? 0.5 : 1,
														cursor: isAdmin
															? 'not-allowed'
															: 'pointer',
													}}
													onClick={() => {
														if (isAdmin) return;
														else if (_user.isDeactivated) {
															handleActivateUser(_user);
														} else {
															handleDeactivateUser(_user);
														}
													}}
												>
													{_user.isDeactivated
														? 'Aktivieren'
														: 'Deaktivieren'}
												</button>
											</td>
										</tr>
									);
								})}
						</TableBody>
					</Table>
				</UsersContainer>
			</Container>
		</>
	);
};

const UsersContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: clamp(300px, 100%, 1100px);
	gap: 1rem;
	padding: 0 1rem;
	margin-top: 2rem;
`;

const Table = styled.table`
	display: flex;
	gap: 1rem;
	padding: 1rem 1.5rem;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.grey.dark};
	width: 100%;
	border-collapse: collapse;
	overflow-x: auto;
`;

const TableBody = styled.tbody`
	td,
	th {
		text-align: center;
		padding: 7.5px 10px;
	}

	th {
		color: #989b9d;
		text-transform: uppercase;
	}

	tr td {
		border-bottom: 1px solid ${({ theme }) => theme.colors.grey.semi};
	}
`;

const IsMe = styled.span`
	color: #00d400;
	font-size: 0.8rem;

	&::before {
		content: ' (';
		margin-right: 1px;
	}

	&::after {
		content: ')';
		margin-left: 1px;
	}
`;

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
	req,
}) => {
	const sessionToken = req.cookies.session;

	if (!sessionToken) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	const users = await getUsers(sessionToken);

	return {
		props: {
			users,
		},
	};
};

export default UserAdminPage;
