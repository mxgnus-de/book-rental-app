import styled, { keyframes } from 'styled-components';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface NotificationProps {
   message: string;
   type: 'success' | 'error';
   duration?: number;
}

interface ElementProps {
   duration?: number;
}

export function Notification({ message, type, duration }: NotificationProps) {
   return (
      <Wrapper duration={duration}>
         <MessageWrapper>
            {type === 'success' ? <SuccessIcon /> : <ErrorIcon />}{' '}
            <Message>{message}</Message>
         </MessageWrapper>
         <Progress duration={duration} />
      </Wrapper>
   );
}

const FadeAnimation = keyframes`
   0% {
      opacity: 0;
      visibility: hidden;
      transform: translateY(-30px);
   }
   10% {
      opacity: 1;
      visibility: visible;
      transform: translateY(0px);
   }
   90% {
      opacity: 1;
      transform: translateY(0px);
   }
   95% {
      opacity: 0;
   }
   100% {
      opacity: 0;
      transform: translateY(-30px);
   }
`;

const ProgressAnimation = keyframes`
   to {
      width: calc(100% - 18px);
   }
`;

const Wrapper = styled.div<ElementProps>`
   position: fixed;
   right: 30px;
   top: 30px;
   display: inline-block;
   max-width: 350px;
   padding: 20px 15px;
   border-radius: 4px;
   background-color: #141619;
   color: #f6f5f9;
   box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
   transform: translateY(30px);
   opacity: 0;
   visibility: hidden;
   animation: ${FadeAnimation} ${({ duration }) => duration || 4}s linear
      forwards;
   z-index: 100;
`;

const MessageWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: flex-start;
   gap: 10px;
`;

const ErrorIcon = styled(ReportProblemRoundedIcon)`
   path {
      color: #ff0000;
   }
`;

const SuccessIcon = styled(CheckCircleRoundedIcon)`
   path {
      color: #00ff00;
   }
`;

const Message = styled.p`
   font-size: 14px;
`;

const Progress = styled.span<ElementProps>`
   position: absolute;
   left: 5px;
   bottom: 5px;
   width: 0;
   height: 3px;
   background-image: linear-gradient(to right, #529bdb, #3250bf);
   border-radius: 4px;
   animation: ${ProgressAnimation} ${({ duration }) => (duration || 4) - 1}s
      0.25s linear forwards;
`;
