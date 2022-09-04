import 'styled-components';

declare module 'styled-components' {
   export interface DefaultTheme {
      fonts: {
         primary: string;
         poppins: string;
      };
      colors: {
         grey: {
            light: string;
            semi: string;
            dark: string;
         };
         blue: {
            light: string;
            semi: string;
            dark: string;
         };
      };
      /**
       * @description - xs: 320px, sm: 576px, md: 768px, lg: 992px, xl: 1200px, xxl: 1400px, xxxl: 1536px
       */
      breakpoints: {
         /**
          * @description 1536px (xxxl)
          */
         xxxl: string;
         /**
          * @description 1400px (xxl)
          */
         xxl: string;

         /**
          * @description 1200px (xl)
          */
         xl: string;
         /**
          * @description  992px (lg)
          */
         lg: string;
         /**
          * @description  768px (md)
          */
         md: string;
         /**
          * @description 576px (sm)
          */
         sm: string;
         /**
          * @description 320px (xs)
          */
         xs: string;
      };
      fontSizes: {
         xs: string;
         sm: string;
         md: string;
         lg: string;
         xl: string;
      };
   }
}

export {};
