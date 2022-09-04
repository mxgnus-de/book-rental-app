import styled from 'styled-components';

interface InputLabelProps {
   required?: boolean;
}

export const Headline = styled.h3`
   font-size: 2.5rem;
   font-weight: normal;
   font-family: ${({ theme }) => theme.fonts.poppins};
`;

export const FormWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   align-items: center;
   min-width: 300px;
   gap: 20px;
   margin-top: 3rem;

   @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      min-width: 250px;
   }
`;

export const InputWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   align-items: flex-start;
   width: 100%;
   gap: 5px;
`;

export const InputLabel = styled.label<InputLabelProps>`
   font-size: 0.9rem;
   font-weight: normal;

   &::after {
      content: '${({ required }) => (required ? '*' : '')}';
      color: #ff0000;
      margin-left: 5px;
      font-size: 16px;
   }
`;

export const Input = styled.input`
   width: 100%;
   height: 40px;
   padding: 2.5px 10px;
   border: 1.5px solid ${({ theme }) => theme.colors.grey.semi};
   border-radius: 5px;
`;

export const SubmitButtonWrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 10px;
   width: 100%;
   margin-top: 1rem;
`;

export const SubmitButton = styled.button`
   width: 100%;
   padding: 7.5px 20px;
   background-color: ${({ theme }) => theme.colors.blue.light};
   border-radius: 20px;
   font-size: 1.1rem;
   font-family: ${({ theme }) => theme.fonts.poppins};
   transition: all 0.3s ease-in-out;

   &:hover {
      background-color: ${({ theme }) => theme.colors.blue.dark};
   }
`;

export const FooterContainer = styled.div`
   margin-top: 2rem;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   gap: 5px;
`;

export const FooterContent = styled.p``;
