import styled from 'styled-components';

interface ContainerProps {
   alignItems?: 'center' | 'flex-start' | 'flex-end';
   justifyContent?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around';
   margin?: string;
   marginTop?: string;
   marginBottom?: string;
   marginLeft?: string;
   marginRight?: string;
   flexDirection?: 'row' | 'column';
   position?: 'relative' | 'absolute' | 'fixed';
   top?: string;
   left?: string;
   right?: string;
   bottom?: string;
   width?: string;
   height?: string;
   padding?: string;
   paddingTop?: string;
   paddingBottom?: string;
   paddingLeft?: string;
   paddingRight?: string;
   gap?: string;
}

export const Container = styled.div<ContainerProps>`
   position: relative;
   display: flex;
   flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
   align-items: ${({ alignItems }) => alignItems || 'center'};
   justify-content: ${({ justifyContent }) => justifyContent || 'center'};
   flex-grow: 1;
   text-align: center;
   width: ${({ width }) => width || '100%'};
   height: ${({ height }) => height || '100%'};
   margin-top: ${({ marginTop }) => marginTop || '0'};
   margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
   margin-left: ${({ marginLeft }) => marginLeft || '0'};
   margin-right: ${({ marginRight }) => marginRight || '0'};
   ${({ position }) => position && `position: ${position}`};
   ${({ top }) => top && `top: ${top}`};
   ${({ left }) => left && `left: ${left}`};
   ${({ right }) => right && `right: ${right}`};
   ${({ bottom }) => bottom && `bottom: ${bottom}`};
   ${({ padding }) => padding && `padding: ${padding}`};
   ${({ paddingTop }) => paddingTop && `padding-top: ${paddingTop}`};
   ${({ paddingBottom }) =>
      paddingBottom && `padding-bottom: ${paddingBottom}`};
   ${({ paddingLeft }) => paddingLeft && `padding-left: ${paddingLeft}`};
   ${({ paddingRight }) => paddingRight && `padding-right: ${paddingRight}`};
   ${({ gap }) => gap && `gap: ${gap}`};
`;
