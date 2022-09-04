import {
	AccountVerifiedTemplateProps,
	VerifyAccountTemplateProps,
} from '@book-rental-app/templates/mail';
import { queueTemplateMail } from '.';
import { Options as MailOptions } from 'nodemailer/lib/mailer';

interface TemplateOptions<T> {
	props: T;
	mailOptions: MailOptions;
}

export function queueAccountVerificationTemplate({
	props,
	mailOptions,
}: TemplateOptions<VerifyAccountTemplateProps>) {
	queueTemplateMail({
		template: 'verifyAccount',
		templateProps: props,
		mailOptions: mailOptions,
	});
}

export function queueAccountVerifiedTemplate({
	props,
	mailOptions,
}: TemplateOptions<AccountVerifiedTemplateProps>) {
	queueTemplateMail({
		template: 'accountVerified',
		templateProps: props,
		mailOptions: mailOptions,
	});
}
