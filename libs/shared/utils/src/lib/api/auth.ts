import { UserApiResponse } from '@book-rental-app/shared/types';
import { apiClient } from '.';

export async function getUser(sessionToken?: string) {
	const headers: Record<string, string> = {};
	if (sessionToken) headers['Authorization'] = sessionToken;

	try {
		const response = await apiClient.get<UserApiResponse>('/@me', {
			headers,
		});
		return response.data.user ?? null;
	} catch (error) {
		return null;
	}
}
