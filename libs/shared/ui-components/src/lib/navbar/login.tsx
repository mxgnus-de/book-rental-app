import styled from 'styled-components';
import LoginIcon from '@mui/icons-material/Login';
import Link from 'next/link';

function Login() {
   return (
      <Link href="/login">
         <LoginWrapper>
            <LoginIcon />
            <span>Login</span>
         </LoginWrapper>
      </Link>
   );
}

const LoginWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   gap: 5px;
   cursor: pointer;

   span {
      font-family: ${({ theme }) => theme.fonts.poppins};
   }
`;

export default Login;
