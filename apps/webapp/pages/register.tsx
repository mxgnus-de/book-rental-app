import { useNotifications } from '@book-rental-app/shared/stores';
import {
	RegisterApiRequest,
	RegisterApiResponse,
} from '@book-rental-app/shared/types';
import { WrappedLoadingSpinner } from '@book-rental-app/shared/ui-components';
import { apiClient, emailRegex } from '@book-rental-app/shared/utils';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
	FooterContainer,
	FooterContent,
	FormWrapper,
	Headline,
	Input,
	InputLabel,
	InputWrapper,
	SubmitButton,
	SubmitButtonWrapper,
} from '../components/auth/components';
import AuthLayout from '../components/auth/layout';

const RegisterPage: NextPage = () => {
	const [surname, setSurname] = useState('');
	const [lastname, setLastname] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [birthday, setBirthday] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const router = useRouter();

	const canRegister =
		surname && lastname && username && email && password && birthday;

	async function register() {
      const mailDomain = email.split('@')[1];

		if (!canRegister) {
			return showErrorNotification('Bitte fülle alle Felder aus!');
		} else if (password.length < 8) {
			return showErrorNotification(
				'Dein Passwort muss mindestens 8 Zeichen lang sein!'
			);
		} else if (mailDomain.includes('outlook')) {
			return showErrorNotification(`${mailDomain} E-Mail Addressen können leider nicht unterstützt werden :/`);
		}

		setIsLoading(true);

		try {
			const payload: RegisterApiRequest = {
				username,
				surname,
				lastname,
				email,
				birthday,
				password,
			};

			const response = await apiClient.post<RegisterApiResponse>(
				'/auth/register',
				payload
			);

			const { success } = response.data;

			if (success) {
				showSuccessNotification(
					'Du hast dich erfolgreich registriert! Bitte schaue in deinem Posteingang nach, um deine Registrierung zu bestätigen.',
					15
				);
				router.push('/login');
			}
		} catch (err) {
			showErrorNotification(
				'Beim Registrieren ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<AuthLayout bgImage="/images/library_art.min.jpg">
			<Headline>Registrieren</Headline>
			<FormWrapper>
				<InputWrapper>
					<InputLabel required>Vorname</InputLabel>
					<Input
						type="text"
						placeholder="Max"
						value={surname}
						onChange={(e) => setSurname(e.target.value)}
					/>
				</InputWrapper>
				<InputWrapper>
					<InputLabel required>Nachname</InputLabel>
					<Input
						type="text"
						placeholder="Mustermann"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>
				</InputWrapper>
				<InputWrapper>
					<InputLabel required>Benutzername</InputLabel>
					<Input
						type="text"
						placeholder="MaxMustermann"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</InputWrapper>
				<InputWrapper>
					<InputLabel required>Email</InputLabel>
					<Input
						type="email"
						placeholder="max.mustermann@example.de"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</InputWrapper>
				<InputWrapper>
					<InputLabel required>Passwort</InputLabel>
					<Input
						type="password"
						placeholder="Passwort"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</InputWrapper>
				<InputWrapper>
					<InputLabel required>Geburtsdatum</InputLabel>
					<Input
						type="date"
						placeholder="Geburtsdatum"
						value={birthday}
						onChange={(e) => setBirthday(e.target.value)}
					/>
				</InputWrapper>
			</FormWrapper>
			<SubmitButtonWrapper>
				<SubmitButton
					onClick={() => !isLoading && register()}
					style={{
						cursor: isLoading ? 'not-allowed' : 'pointer',
					}}
				>
					{isLoading ? <WrappedLoadingSpinner /> : 'Registrieren'}
				</SubmitButton>
			</SubmitButtonWrapper>
			<FooterContainer>
				<FooterContent>
					Du hast schon einen Account?{' '}
					<span
						style={{
							fontWeight: 'bold',
						}}
					>
						<Link href="/login">Einloggem</Link>
					</span>
				</FooterContent>
			</FooterContainer>
		</AuthLayout>
	);
};

export default RegisterPage;
