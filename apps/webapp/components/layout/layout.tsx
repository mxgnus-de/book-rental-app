import {
	Container,
	Navbar,
	Footer,
} from '@book-rental-app/shared/ui-components';

interface LayoutProps {
	children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
	return (
		<>
			<Navbar />
			<Container justifyContent="flex-start" as="main">
				{children}
			</Container>
			<Footer />
		</>
	);
}

export default Layout;
