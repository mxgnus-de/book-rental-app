import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
   fonts: {
      primary: '"Inter", sans-serif',
      poppins: '"Poppins", sans-serif',
   },
   colors: {
      grey: {
         light: '#323E4B',
         semi: '#2D3238',
         dark: '#252A2F',
      },
      blue: {
         light: '#2FB4FF',
         semi: '#2AA8FF',
         dark: '#1E96FF',
      },
   },
   breakpoints: {
      xxxl: '1536px',
      xxl: '1400px',
      xl: '1200px',
      lg: '992px',
      md: '768px',
      sm: '576px',
      xs: '320px',
   },
   fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
   },
};
