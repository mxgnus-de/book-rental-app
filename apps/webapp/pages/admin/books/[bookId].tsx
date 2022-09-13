import { AdminBook } from '@book-rental-app/shared/types';
import { getAdminBook } from '@book-rental-app/shared/utils';
import EditBook from 'apps/webapp/components/admin/book/edit';
import { GetServerSideProps, NextPage } from 'next';

interface PageProps {
	book: AdminBook;
}

const AdminEditBookPage: NextPage<PageProps> = ({ book }) => {
	return <EditBook book={book} mode="edit" />;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
	req,
	query,
}) => {
	const sessionToken = req.cookies.session;
	const bookId = query.bookId as string;

	if (!sessionToken) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	const book = await getAdminBook(bookId, sessionToken);

	if (!book) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			book,
		},
	};
};

export default AdminEditBookPage;
