import { BigBox } from '@book-rental-app/shared/ui-components';
import Image from 'next/image';
import styled from 'styled-components';

interface AuthLayoutProps {
   children: React.ReactNode;
   bgImage: string;
}

function AuthLayout({ children, bgImage }: AuthLayoutProps) {
   return (
      <Wrapper>
         <ImageWrapper>
            <Image
               src={bgImage}
               alt="background"
               quality={70}
               layout="fixed"
               width={1920}
               height={1080}
            />
         </ImageWrapper>
         <Container>
            <BoxContainer>{children}</BoxContainer>
         </Container>
      </Wrapper>
   );
}

const Wrapper = styled.div`
   width: 100%;
   height: 100%;
   flex-grow: 1;
   display: flex;
   justify-content: flex-end;
   align-items: center;
   position: relative;
   overflow: hidden;

   @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      justify-content: center;
   }
`;

const ImageWrapper = styled.div`
   position: absolute;
   width: 100%;
   height: 100%;
`;

const Container = styled.div`
   z-index: 10;
   width: 50%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   padding: 3rem 2rem;

   @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      width: 100%;
   }
`;

const BoxContainer = styled(BigBox)`
   padding: 3rem 2.5rem;
`;

export default AuthLayout;
