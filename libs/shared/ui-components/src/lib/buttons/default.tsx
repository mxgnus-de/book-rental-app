import styled from 'styled-components';

export interface DefaultButtonProps {
   color?: string;
   hoverColor?: string;
   margin?: string;
   padding?: string;
   fontSize?: string;
   fontWeight?: string;
   borderRadius?: string;
   border?: string;
   borderColor?: string;
   borderWidth?: string;
   borderStyle?: string;
   backgroundColor?: string;
}

export const DefaultButton = styled.button<DefaultButtonProps>`
   padding: 5px 20px;
   border-radius: 15px;
   ${({ color }) => color && `color: ${color};`}
   ${({ hoverColor }) => hoverColor && `&:hover { color: ${hoverColor} };`}
   ${({ margin }) => margin && `margin: ${margin};`}
   ${({ padding }) => padding && `padding: ${padding};`}
   ${({ fontSize }) => fontSize && `font-size: ${fontSize};`}
   ${({ fontWeight }) => fontWeight && `font-weight: ${fontWeight};`}
   ${({ borderRadius }) => borderRadius && `border-radius: ${borderRadius};`}
   ${({ border }) => border && `border: ${border};`}
   ${({ borderColor }) => borderColor && `border-color: ${borderColor};`}
   ${({ borderWidth }) => borderWidth && `border-width: ${borderWidth};`}
   ${({ borderStyle }) => borderStyle && `border-style: ${borderStyle};`}
   ${({ backgroundColor }) =>
      backgroundColor && `background-color: ${backgroundColor};`}
`;
