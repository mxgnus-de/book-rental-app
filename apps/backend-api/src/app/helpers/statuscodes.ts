export const STATUS_CODES = {
   OK: 200,
   CREATED: 201,
   ACCEPTED: 202,
   NO_CONTENT: 204,
   BAD_REQUEST: 400,
   UNAUTHORIZED: 401,
   FORBIDDEN: 403,
   NOT_FOUND: 404,
   NOT_ACCEPTED: 406,
   CONFLICT: 409,
   PAYLOAD_TOO_LARGE: 413,
   LOCKED: 423,
   TOO_MANY_REQUESTS: 429,
   INTERNAL_SERVER_ERROR: 500,
   BAD_GATEWAY: 502,
   SERVICE_UNAVAILABLE: 503,
   GATEWAY_TIMEOUT: 504,
};

export type StatusCode = keyof typeof STATUS_CODES;

export const getStatusCode = (statusCode: StatusCode): number => {
   return STATUS_CODES[statusCode];
};

export const getStatusText = (statusCode: StatusCode): string => {
   return statusCode;
};

export const getStatusMessageFromStatusCode = (statusCode: number): string => {
   return (
      Object.values(STATUS_CODES)
         .find((code) => code === statusCode)
         ?.toString() || ''
   );
};
