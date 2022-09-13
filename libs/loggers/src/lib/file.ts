import winston, { createLogger, format, transports } from 'winston';
import { Logger } from './console';

const isProduction = process.env.NODE_ENV === 'production';

function createFileLogger(service: string) {
	const logger = createLogger({
		level: 'info',
		format: format.combine(
			format.timestamp({
				format: 'DD-MM-YYYY HH:mm:ss',
			}),
			format.errors({ stack: true }),
			format.splat(),
			format.json()
		),
		defaultMeta: { service },
		transports: [
			new transports.File({
				filename: `logs/error.${service}.${
					isProduction ? 'prod' : 'dev'
				}.log`,
				level: 'error',
			}),
			new transports.File({
				filename: `logs/debug.${service}.${
					isProduction ? 'prod' : 'dev'
				}.log`,
				level: 'debug',
			}),
			new transports.File({
				filename: `logs/all.${service}.${
					isProduction ? 'prod' : 'dev'
				}.log`,
			}),
		],
	});

	return logger;
}

export class FileLogger {
	private logger: winston.Logger;
	public service: string;
	public consolelogger = new Logger();

	constructor(service: string) {
		this.service = service;
		this.logger = createFileLogger(this.service);
	}

	public log(
		level: 'info' | 'warn' | 'error',
		message: any,
		withoutConsole?: true
	): void {
		if (withoutConsole !== true) this.consolelogger.log(level, message);
		this.logger.log(level, message);
	}

	public info(message: any, withoutConsole?: true): void {
		if (this.shouldConsoleLog(withoutConsole))
			this.consolelogger.info(message);
		this.logger.info(message);
	}

	public error(message: any, withoutConsole?: true): void {
		if (this.shouldConsoleLog(withoutConsole))
			this.consolelogger.error(message);
		this.logger.error(message);
	}

	public warn(message: any, withoutConsole?: true): void {
		if (this.shouldConsoleLog(withoutConsole))
			this.consolelogger.warn(message);
		this.logger.warn(message);
	}

	public debug(message: any, withoutConsole?: true): void {
		if (this.shouldConsoleLog(withoutConsole))
			this.consolelogger.debug(message);
		this.logger.debug(message);
	}

	private shouldConsoleLog(withoutConsole?: true) {
		if (isProduction) return false;
		else if (withoutConsole) return false;
		else return true;
	}
}
