import EditBook from 'apps/webapp/components/admin/book/edit';
import { NextPage } from 'next';

const AdminEditBookPage: NextPage = () => {
	return <EditBook mode="create" />;
};

export default AdminEditBookPage;
