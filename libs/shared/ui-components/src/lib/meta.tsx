import Head from 'next/head';

interface MetaProps {
	title: string;
	description?: string;
	serviceUrl?: string;
}

export function Meta({ title, description, serviceUrl }: MetaProps) {
	const defaultDescription = 'Book Rental App';
	const defaultTitle = 'Book Rental App • ';
	const themeColor = '#2FB4FF';

	const titleWithDefault = `${defaultTitle}${title}`;
	const descriptionOrDefault = description || defaultDescription;

	return (
		<Head>
			<title>{titleWithDefault}</title>
			<meta name="description" content={descriptionOrDefault} />
			<meta name="theme-color" content={themeColor} />
			<meta name="og:title" content={titleWithDefault} />
			<meta name="title" content={titleWithDefault} />
			<meta name="og:description" content={descriptionOrDefault} />
			<meta name="og:image" content="/images/logos/logo.png" />
			<meta
				name="og:url"
				content={serviceUrl || process.env.NEXT_PUBLIC_SERVICE_URL}
			/>
			<link
				rel="shortcut icon"
				type="image/x-icon"
				href="/images/logos/logo.png"
			/>
		</Head>
	);
}
