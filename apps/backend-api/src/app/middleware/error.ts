import { NextFunction, Request, Response } from 'express';
import { fileLogger } from '../../main';
import ApiError from '../helpers/error';

export default async function errorHandlerMiddleware(
   err: any,
   req: Request,
   res: Response
) {
   const fields: Record<string, string> = {};

   if (process.env.NODE_ENV !== 'production') {
      fields.message = err.message;
      fields.stack = err.stack;
   }

   fileLogger.error(err, true);
   fileLogger.consolelogger.warn(
      `${req.method} ${req.originalUrl} generated an error ${err.message}\nFor more information, see the logs`
   );

   new ApiError({
      statusCode: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      fields: Object.keys(fields).length ? fields : undefined,
   }).send(res);
}

type Handler = (
   req: Request,
   res: Response,
   next: NextFunction
) => any | Promise<any>;

export const withErrorHandler = (handler: Handler) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      try {
         await handler(req, res, next);
      } catch (error) {
         return errorHandlerMiddleware(error, req, res);
      }
   };
};
