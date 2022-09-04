import styled from 'styled-components';
import { DefaultButton } from './default';

export const DarkGreyButton = styled(DefaultButton)`
   background-color: ${({ theme }) => theme.colors.grey.dark};
`;

export const SemiGreyButton = styled(DefaultButton)`
   background-color: ${({ theme }) => theme.colors.grey.semi};
`;

export const LightGreyButton = styled(DefaultButton)`
   background-color: ${({ theme }) => theme.colors.grey.light};
`;
