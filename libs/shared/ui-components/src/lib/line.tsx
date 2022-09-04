import styled, { useTheme } from 'styled-components';

interface DefaultLineProps {
   width?: string;
   height?: string;
   bgcolor: string;
}

type LineProps = Omit<DefaultLineProps, 'bgcolor'>;

export function BlueLine({ width, height }: LineProps) {
   const theme = useTheme();

   return (
      <DefaultLine
         width={width}
         height={height}
         bgcolor={theme.colors.blue.light}
      />
   );
}

const DefaultLine = styled.span<DefaultLineProps>`
   width: ${({ width }) => width || '100%'};
   height: ${({ height }) => height || '10px'};
   background-color: ${({ bgcolor }) => bgcolor};
   display: block;
`;
