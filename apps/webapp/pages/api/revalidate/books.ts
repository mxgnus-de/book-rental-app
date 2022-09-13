import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method } = req;

	if (method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { bookId } = req.body;
	const token = req.headers.authorization;

	if (!token || token !== process.env.INTERNAL_REVALIDATION_SECRET) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	try {
		if (bookId) {
			await res.revalidate('/books/details/' + bookId);
		}
		await res.revalidate('/');
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}

	res.status(200).json({ message: 'Revalidation started' });
}

export default handler;
