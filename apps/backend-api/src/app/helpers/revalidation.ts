import axios from 'axios';
import { fileLogger } from '../../main';

export async function revalidateFrontendBooks(bookId?: string) {
	const token = process.env.INTERNAL_REVALIDATION_SECRET;

	if (!token) {
		fileLogger.error('No token found for revalidation');
		return false;
	}

	try {
		await axios.post(
			process.env.NEXT_PUBLIC_SERVICE_URL + '/api/revalidate/books',
			{
				bookId,
			},
			{
				headers: {
					Authorization: token,
				},
			}
		);

		return true;
	} catch (error) {
		fileLogger.error(error);
		return false;
	}
}
