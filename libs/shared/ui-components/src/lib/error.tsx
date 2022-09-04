import Link from 'next/link';
import styled from 'styled-components';
import { DarkGreyButton } from './buttons/grey';
import { Container } from './container';
import { Meta } from './meta';

export function Error({
   statusCode,
   statusText,
}: {
   statusCode: number;
   statusText: string;
}) {
   return (
      <>
         <Meta title={'Error - ' + statusCode} description={statusText} />
         <Container>
            <div>
               <ErrorCode>{statusCode}</ErrorCode>
               <ErrorMessageWrapper>
                  <ErrorMessage>{statusText}</ErrorMessage>
               </ErrorMessageWrapper>
            </div>
            <Link href="/" passHref>
               <DarkGreyButton margin="1rem 0">
                  Zurück zur Startseite
               </DarkGreyButton>
            </Link>
         </Container>
      </>
   );
}

export function GenerateError(
   error:
      | {
           statusCode: number;
           statusText: string;
        }
      | boolean
) {
   if (error === false) return null;
   else if (typeof error === 'boolean')
      return <Error statusCode={500} statusText="Etwas ist schief gelaufen" />;
   else if (typeof error === 'object')
      return (
         <Error statusCode={error.statusCode} statusText={error.statusText} />
      );
   else return null;
}

const ErrorCode = styled.h1`
   display: inline-block;
   border-right: 1px solid rgba(255, 255, 255, 0.3);
   margin: 0;
   margin-right: 20px;
   padding: 10px 23px 10px 0;
   font-size: 24px;
   font-weight: bold;
   vertical-align: top;
`;

const ErrorMessageWrapper = styled.div`
   display: inline-block;
   text-align: left;
   line-height: 49px;
   height: 49px;
   vertical-align: middle;
`;

const ErrorMessage = styled.h2`
   font-size: 16px;
   font-weight: normal;
   line-height: inherit;
   margin: 0;
   padding: 0;
   font-weight: normal;
   font-family: ${({ theme }) => theme.fonts.primary};
`;
