import styled from 'styled-components';

export const BigBox = styled.div`
   width: fit-content;
   padding: 30px 20px;
   border-radius: 10px;
   box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
   background-color: ${({ theme }) => theme.colors.grey.light};
`;
