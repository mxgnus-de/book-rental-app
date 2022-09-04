import { CircularProgress } from '@mui/material';
import styled from 'styled-components';

export function LoadingSpinner() {
   return <CircularProgress color="secondary" />;
}

export function WrappedLoadingSpinner() {
   return (
      <SpinnerWrapper>
         <LoadingSpinner />
      </SpinnerWrapper>
   );
}

const SpinnerWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
   width: 100%;
`;
