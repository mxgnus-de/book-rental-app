import NextNprogress from 'nextjs-progressbar';
import { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '@book-rental-app/shared/config';
import {
	GlobalDefaultStyle,
	Meta,
	Notification,
	UserProvider,
} from '@book-rental-app/shared/ui-components';
import Layout from '../components/layout/layout';
import { useNotifications } from '@book-rental-app/shared/stores';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

function WebApp({ Component, pageProps, router }: AppProps) {
	const notifications = useNotifications();

	return (
		<>
			<Meta title="Home" />
			<NextNprogress
				options={{
					showSpinner: false,
				}}
				color="#fff"
				showOnShallow={false}
			/>
			<ThemeProvider theme={defaultTheme}>
				<CookiesProvider>
					<GlobalDefaultStyle />
					<UserProvider user={(pageProps as any).user ?? null}>
						{notifications.visible && (
							<Notification
								message={notifications.message}
								type={notifications.type}
								duration={notifications.duration}
							/>
						)}
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</UserProvider>
				</CookiesProvider>
			</ThemeProvider>
		</>
	);
}

export default WebApp;
