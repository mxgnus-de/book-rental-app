import { Error } from '@book-rental-app/shared/ui-components';
import { NextPage } from 'next';

const ErrorPage: NextPage = () => {
	return (
		<Error statusCode={404} statusText="Diese Seite wurde nicht gefunden" />
	);
};

export default ErrorPage;
