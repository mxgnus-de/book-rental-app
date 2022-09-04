import { defaultTheme } from '@book-rental-app/shared/config';
import { ThemeProvider } from 'styled-email-components';
import { Container, Header } from './components';

interface DefaultTemplateProps {
	children: React.ReactNode;
}

function DefaultTemplate({ children }: DefaultTemplateProps) {
	return (
		<ThemeProvider theme={defaultTheme}>
			<Container>
				<Header />
				{children}
			</Container>
		</ThemeProvider>
	);
}

export default DefaultTemplate;
