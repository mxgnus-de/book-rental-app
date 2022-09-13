import { useNotifications } from '@book-rental-app/shared/stores';
import {
	LoginApiRequest,
	LoginApiResponse,
	ResendVerificationCodeResponse,
} from '@book-rental-app/shared/types';
import {
	Meta,
	useUser,
	useUserUpdate,
	WrappedLoadingSpinner,
} from '@book-rental-app/shared/ui-components';
import { apiClient, emailRegex } from '@book-rental-app/shared/utils';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
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

const LoginPage: NextPage = () => {
	const [usernameOrEmail, setusernameOrEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { setUser } = useUserUpdate();
	const { showErrorNotification, showSuccessNotification } =
		useNotifications();
	const router = useRouter();
	const [_, setCookie] = useCookies(['session']);
	const [resendCodeEmail, setResendCodeEmail] = useState<string | null>(null);
	const [resendCode, setResendCode] = useState<string | null>(null);
	const [showResendCodeButton, setShowResendCodeButton] = useState(false);
	const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
	const user = useUser();

	useEffect(() => {
		if (user) {
			router.push(redirectUrl || '/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		const redirectUrl = router.query.redirect;

		if (redirectUrl && typeof redirectUrl === 'string') {
			try {
				const url = new URL(redirectUrl);
				setRedirectUrl(url.href);
			} catch (err) {
				setRedirectUrl(null);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	async function login() {
		if (!usernameOrEmail || !password) {
			return showErrorNotification('Bitte fülle alle Felder aus!');
		}
		const isEmail = emailRegex.test(usernameOrEmail);

		setIsLoading(true);

		try {
			const payload: LoginApiRequest = {
				password,
				usernameOrEmail,
			};

			const response = await apiClient.post<LoginApiResponse>(
				'/auth/login',
				payload
			);

			const { data } = response;

			if (data.success === false && data.isVerified === false) {
				if (data.resendCode && data.email) {
					setResendCode(data.resendCode);
					setResendCodeEmail(data.email);
				}

				return showErrorNotification(
					`${
						data.email
							? `Dein Account mit der E-Mail ${data.email} wurde noch nicht verifiziert`
							: 'Dein Account wurde noch nicht verifiziert'
					}! Bitte überprüfe deine E-Mails!`
				);
			} else if (data.success === false && data.isDeactivated === true) {
				return showErrorNotification(
					'Dein Account ist auf unbestimmte Zeit deaktiviert!'
				);
			} else if (data.success === true) {
				setCookie('session', data.sessionId, {
					domain: process.env.NEXT_PUBLIC_COOKIES_HOSTNAME,
					path: '/',
					maxAge: 60 * 60 * 24 * 7, // 7 days
				});
				showSuccessNotification('Du wurdest erfolgreich eingeloggt!', 4);
				setUser(data.user);
			}
		} catch (error) {
			if (isEmail) {
				showErrorNotification('Email oder Passwort falsch');
			} else {
				showErrorNotification('Username oder Passwort falsch');
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function resendVerificationCode() {
		if (!resendCode && !resendCodeEmail)
			return showErrorNotification(
				'Hmmm, da ist etwas schiefgelaufen. Bitte vesuche es später erneut'
			);

		setIsLoading(true);

		try {
			const response = await apiClient.post<ResendVerificationCodeResponse>(
				`/auth/resend-verification-code?token=${resendCode}`
			);

			showSuccessNotification(
				`Der Verifikationscode wurde erfolgreich erneut an die E-Mail ${
					response.data.email || resendCodeEmail
				} gesendet!`,
				5
			);

			setResendCodeEmail(null);
			setResendCode(null);
			setShowResendCodeButton(false);
		} catch (err) {
			showErrorNotification(
				`Der Verifikationscode konnte nicht erneut an die E-Mail ${resendCodeEmail} gesendet werden. Bitte versuche es später erneut.`,
				6
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Meta title="Einloggen" />
			<AuthLayout bgImage="/images/library_art.min.jpg">
				<Headline>Anmelden</Headline>
				<FormWrapper>
					<InputWrapper>
						<InputLabel required>Benutzername/Email</InputLabel>
						<Input
							type="text"
							placeholder="Benutzername oder Email"
							value={usernameOrEmail}
							onChange={(e) => setusernameOrEmail(e.target.value)}
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
				</FormWrapper>
				<SubmitButtonWrapper>
					<SubmitButton
						onClick={() => !isLoading && login()}
						style={{
							cursor: isLoading ? 'not-allowed' : 'pointer',
						}}
					>
						{isLoading ? <WrappedLoadingSpinner /> : 'Einloggen'}
					</SubmitButton>
					{showResendCodeButton && (
						<SubmitButton
							onClick={() => !isLoading && resendVerificationCode()}
							style={{
								cursor: isLoading ? 'not-allowed' : 'pointer',
							}}
						>
							{isLoading ? (
								<WrappedLoadingSpinner />
							) : (
								'Verifikationscode erneut senden'
							)}
						</SubmitButton>
					)}
				</SubmitButtonWrapper>
				<FooterContainer>
					{!showResendCodeButton && resendCodeEmail && resendCode && (
						<FooterContent
							style={{
								fontSize: '14px',
								color: '#bebebe',
							}}
							as="button"
							onClick={() => setShowResendCodeButton(true)}
						>
							Du hast keine Email bekommen?
						</FooterContent>
					)}
					<FooterContent>
						Noch keinen Account?{' '}
						<span
							style={{
								fontWeight: 'bold',
							}}
						>
							<Link href="/register">Registrieren</Link>
						</span>
					</FooterContent>
				</FooterContainer>
			</AuthLayout>
		</>
	);
};

export default LoginPage;
