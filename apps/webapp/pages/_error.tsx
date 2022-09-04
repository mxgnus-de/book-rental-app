import { Error } from '@book-rental-app/shared/ui-components';
import { NextPage } from 'next';

interface SiteProps {
   statusCode: number;
   statusMessage: string;
}

const PageError: NextPage<SiteProps> = ({ statusCode, statusMessage }) => {
   return (
      <>
         <Error statusCode={statusCode} statusText={statusMessage} />
      </>
   );
};

export default PageError;
