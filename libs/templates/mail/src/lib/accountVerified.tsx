import { Button } from './components';
import DefaultTemplate from './default';

export interface AccountVerifiedTemplateProps {
	username: string;
	email: string;
}

function AccountVerifiedTemplate({ username }: AccountVerifiedTemplateProps) {
	return (
		<DefaultTemplate>
			<p style={{ marginTop: '10px' }}>Hey {username} 👋!</p>
			<p>
				Du hast deinen Account erfolgreich verifiziert. Du kannst dich nun{' '}
				<a href={`${process.env.NEXT_PUBLIC_SERVICE_URL}/login`}>
					Anmelden{''}
				</a>
			</p>
			<Button
				as="a"
				href={`${process.env.NEXT_PUBLIC_SERVICE_URL}/login`}
				style={{ marginTop: '5px' }}
			>
				Anmelden
			</Button>
		</DefaultTemplate>
	);
}

export const AccountVerifiedEmailTemplate = (
	props: AccountVerifiedTemplateProps
) => ({
	subject: `Account Verifikation abgeschlossen - ${props.username}`,
	body: <AccountVerifiedTemplate {...props} />,
});
