export interface BaseEnvironment {
   /* NODE */
   NODE_ENV: 'development' | 'production';

   /* API */
   NEXT_PUBLIC_API_ENDPOINT: string;

   /* SERVICE */
   NEXT_PUBLIC_SERVICE_URL: string;

   /* SERVER */
   NEXT_PUBLIC_COOKIES_HOSTNAME: string;
}
