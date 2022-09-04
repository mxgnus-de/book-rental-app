import { Button } from './components';
import DefaultTemplate from './default';

export interface VerifyAccountTemplateProps {
	username: string;
	email: string;
	verificationCode: string;
}

function VerifyAccountTemplate({
	username,
	verificationCode,
}: VerifyAccountTemplateProps) {
	return (
		<DefaultTemplate>
			<p style={{ marginTop: '10px' }}>Hey {username} 👋!</p>
			<p>
				Bitte klicke auf den untenliegenden Button um deine Account
				Verifikation abzuschließen
			</p>
			<Button
				as="a"
				href={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/verify?token=${verificationCode}`}
				style={{ marginTop: '5px' }}
			>
				Verifikation abschließen
			</Button>
		</DefaultTemplate>
	);
}

export const VerifyAccountEmailTemplate = (props: VerifyAccountTemplateProps) => ({
	subject: `Account Verifikation - ${props.username}`,
	body: <VerifyAccountTemplate {...props} />,
});

export default VerifyAccountEmailTemplate;
