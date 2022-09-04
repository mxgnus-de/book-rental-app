import Head from 'next/head';

interface MetaProps {
   title: string;
   description?: string;
   keywords?: string[];
   serviceUrl?: string;
}

export function Meta({ title, description, keywords, serviceUrl }: MetaProps) {
   const defaultDescription = 'Book Rental App';
   const themeColor = '#3F2260';

   return (
      <Head>
         <title>{title}</title>
         <meta name="description" content={description || defaultDescription} />
         <meta name="theme-color" content={themeColor} />
         <meta name="og:title" content={title} />
         <meta
            name="og:description"
            content={description || defaultDescription}
         />
         <meta name="og:image" content="/images/logos/logo.png" />
         <meta name="og:url" content={serviceUrl} />
         <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/images/logos/logo.png"
         />
      </Head>
   );
}
