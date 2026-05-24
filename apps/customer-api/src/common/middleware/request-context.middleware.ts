import { Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

function getRequestId(request: Request) {
  const headerValue = request.header('x-request-id');
  return headerValue?.trim() || randomUUID();
}

const logger = new Logger('RequestContext');

export function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const requestId = getRequestId(request);
  const startedAt = Date.now();

  response.setHeader('x-request-id', requestId);

  response.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    logger.log(
      `${request.method} ${request.originalUrl} ${response.statusCode} ${durationMs}ms requestId=${requestId}`,
    );
  });

  next();
}
