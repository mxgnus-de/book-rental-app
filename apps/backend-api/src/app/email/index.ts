import { Options as MailOptions } from 'nodemailer/lib/mailer';
import { Mailer } from 'nodemailer-react';
import { fileLogger } from '../../main';
import {
	AccountVerifiedEmailTemplate,
	VerifyAccountEmailTemplate,
} from '@book-rental-app/templates/mail';

type MailTemplates = 'verifyAccount' | 'accountVerified';

interface TemplateMailOptions {
	template: MailTemplates;
	templateProps: Record<string, any>;
	mailOptions: MailOptions;
	queuedAt?: number;
	isRetry?: true;
}

const transport = {
	host: process.env.MAIL_IMAP_HOST,
	port: parseInt(process.env.MAIL_IMAP_PORT),
	secure: true,
	auth: {
		user: process.env.MAIL_IMAP_USER,
		pass: process.env.MAIL_IMAP_PASSWORD,
	},
};

let isMailWorkerRunning = false;
let lastMailSent = 0;
let mailsSendedInLastMinute = 0;
const mailQueue: TemplateMailOptions[] = [];

const defaults = {
	from: process.env.MAIL_IMAP_USER,
};

const mailer = Mailer(
	{
		transport,
		defaults,
	},
	{
		verifyAccount: VerifyAccountEmailTemplate,
		accountVerified: AccountVerifiedEmailTemplate,
	}
);

export async function sendTemplateMail(templateOptions: TemplateMailOptions) {
	const { mailOptions, template, templateProps, isRetry } = templateOptions;

	try {
		const mail = await mailer.send(
			template as any,
			templateProps as any,
			mailOptions
		);

		fileLogger.info(
			`Sending template mail for ${template} to ${
				Array.isArray(mailOptions.to)
					? mailOptions.to?.join(', ')
					: mailOptions.to
			}`
		);
		lastMailSent = Date.now();
		mailsSendedInLastMinute++;
		return mail;
	} catch (e) {
		fileLogger.error(e);
		if (!isRetry) {
			setTimeout(
				() =>
					queueTemplateMail(
						Object.assign(templateOptions, {
							isRetry: true,
						})
					),
				1000 * 60
			);
		}
		return null;
	}
}

export async function queueTemplateMail(mailOptions: TemplateMailOptions) {
	fileLogger.debug(
		`Queueing template mail for ${mailOptions.template} to ${
			Array.isArray(mailOptions.mailOptions.to)
				? mailOptions.mailOptions.to?.join(', ')
				: mailOptions.mailOptions.to
		}`
	);
	mailQueue.push(
		Object.assign(mailOptions, {
			queuedAt: Date.now(),
		})
	);
}

export async function startMailWorker() {
	if (isMailWorkerRunning)
		return fileLogger.error('MailWorker is already running');
	fileLogger.info(`MailWorker started successfully`);

	isMailWorkerRunning = true;

	setInterval(() => {
		if (!mailQueue[0] || !checkMailQueue()) return;

		const mail = mailQueue.shift();
		if (!mail) return;

		sendTemplateMail(mail);
	}, 1000 * 5);

	setInterval(() => (mailsSendedInLastMinute = 0), 1000 * 60);
}

function checkMailQueue(): boolean {
	if (!mailQueue.length) return true;

	if (
		mailsSendedInLastMinute > 3 &&
		mailsSendedInLastMinute <= 5 &&
		lastMailSent < Date.now() - 1000 * 15
	)
		return true;
	else if (
		mailsSendedInLastMinute > 5 &&
		lastMailSent < Date.now() - 1000 * 40
	)
		return true;
	else if (mailsSendedInLastMinute <= 3) return true;
	else return false;
}
