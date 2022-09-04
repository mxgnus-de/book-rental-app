import { Response } from 'express';
import {
   getStatusMessageFromStatusCode,
   getStatusText,
   StatusCode,
   STATUS_CODES,
} from './statuscodes';

class ApiError {
   public statusCode: number;
   public statusText: string;
   public message?: string;
   public fields?: { [key: string]: unknown };

   constructor({
      statusCode,
      statusText,
      message,
      fields,
   }: {
      statusCode: StatusCode | number;
      statusText?: string;
      message?: string;
      fields?: { [key: string]: unknown };
   }) {
      if (typeof statusCode !== 'number') {
         this.statusCode = STATUS_CODES[statusCode];
         this.statusText = getStatusText(statusCode);
      } else {
         this.statusCode = statusCode;
         this.statusText = getStatusMessageFromStatusCode(statusCode);
      }

      if (statusText) this.statusText = statusText;
      this.message = message;
      this.fields = fields;
   }

   public toJSON() {
      return {
         statusCode: this.statusCode,
         statusText: this.statusText,
         message: this.message,
         fields: this.fields,
      };
   }

   public send(res: Response) {
      res.statusCode = this.statusCode;
      res.statusMessage = this.statusText;
      res.setHeader('Content-Type', 'application/json');
      res.json(this.toJSON());
   }
}

export const unauthorized = (
   message?: string,
   fields?: { [key: string]: unknown }
) =>
   new ApiError({
      statusCode: 'UNAUTHORIZED',
      message: message || 'Unauthorized access',
      fields: fields,
   });

export const forbidden = (
   message?: string,
   fields?: { [key: string]: unknown }
) =>
   new ApiError({
      statusCode: 'FORBIDDEN',
      message: message || 'Forbidden access',
      fields,
   });

export const notFound = (
   message?: string,
   fields?: { [key: string]: unknown }
) =>
   new ApiError({
      statusCode: 'NOT_FOUND',
      message: message || 'Not found',
      fields,
   });

export const badRequest = (
   message?: string,
   fields?: { [key: string]: unknown }
) =>
   new ApiError({
      statusCode: 'BAD_REQUEST',
      message: message || 'Bad request',
      fields,
   });

export const internalServerError = (message?: string) =>
   new ApiError({
      statusCode: 'INTERNAL_SERVER_ERROR',
      message: message || 'Internal server error',
   });

export default ApiError;
