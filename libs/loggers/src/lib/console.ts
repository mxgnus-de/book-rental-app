import colors from 'colors';
import moment from 'moment';

export class Logger {
   public log(level: 'info' | 'warn' | 'error' | 'debug', message: any): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.blue(level + ' | ') +
               colors.italic(
                  moment.utc(new Date()).format('YYYY.MM.DD - HH:mm:ss')
               ) +
               ' | '
         ) + colors.cyan(message)
      );
   }

   public info(message: any): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.green('Info | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')
               ) +
               ' | '
         ) + colors.cyan(message)
      );
   }
   public error(message: any): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.red('Error | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')
               ) +
               ' | '
         ) + colors.cyan(message)
      );
   }

   public debug(message: any): void {
      if (process.env.NODE_ENV === 'production') return;
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.blue('Debug | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')
               ) +
               ' | '
         ) + colors.cyan(message)
      );
   }

   public warn(message: any): void {
      // tslint:disable-next-line:no-console
      console.log(
         colors.grey(
            colors.yellow('Warn | ') +
               colors.italic(
                  moment.utc(new Date()).format('DD.MM.YYYY - HH:mm:ss')
               ) +
               ' | '
         ) + colors.cyan(message)
      );
   }
}
