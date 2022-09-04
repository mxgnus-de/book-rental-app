import { useNotifications } from '@book-rental-app/shared/stores';
import {
	LogoutApiResponse,
	UserApiResponse,
	UserWithoutPassword,
} from '@book-rental-app/shared/types';
import { apiClient } from '@book-rental-app/shared/utils';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export interface UserProviderProps {
	children?: any;
	user?: any;
}

export interface UserUpdate {
	setUser: (user: UserWithoutPassword | null) => void;
	revalidateUser: () => void;
	logout: () => void;
}

const UserContext = createContext<UserWithoutPassword | null>(null);
const UserUpdateContext = createContext<UserUpdate>({} as UserUpdate);

export function useUser() {
	return useContext(UserContext);
}

export function useUserUpdate() {
	return useContext(UserUpdateContext);
}

export function UserProvider(props: UserProviderProps) {
	const [user, setUser] = useState<UserWithoutPassword | null>(
		props.user || null
	);
	const [cookies, _, deleteCookie] = useCookies(['session']);
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			revalidateUser();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cookies.session]);

	async function revalidateUser() {
		if (!cookies.session) return;

		try {
			const response = await apiClient.get<UserApiResponse>('/@me');
			setUser(response.data.user);
		} catch (error) {
			setUser(null);
		}
	}

	async function logout() {
		if (!cookies.session || !user) return;

		try {
			const response = await apiClient.post<LogoutApiResponse>(
				'/auth/logout'
			);

			if (response.data.success) {
				showSuccessNotification('Du wurdest erfolgreich ausgeloggt');
				setUser(null);
				deleteCookie('session', {
					path: '/',
					domain: process.env.NEXT_PUBLIC_COOKIES_HOSTNAME,
				});
				router.push('/');
			}
		} catch (err) {
			showErrorNotification(`Es ist ein Fehler beim Einloggen ausgetreten`);
		}
	}

	return (
		<UserContext.Provider value={user}>
			<UserUpdateContext.Provider
				value={{
					setUser,
					revalidateUser,
					logout,
				}}
			>
				{props.children}
			</UserUpdateContext.Provider>
		</UserContext.Provider>
	);
}
