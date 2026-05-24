import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { API_PREFIX } from './app.constants';
import { requestContextMiddleware } from './common/middleware/request-context.middleware';

const DEFAULT_CORS_HEADERS = 'Content-Type,Authorization';
const CORS_METHODS = 'GET,OPTIONS';

function getCorsOrigin() {
  const webOrigin = process.env.WEB_ORIGIN?.trim();

  if (!webOrigin || webOrigin === '*') {
    return '*';
  }

  const origins = webOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length === 1 ? origins[0] : origins;
}

function getRequestOrigin(req: Request) {
  return typeof req.headers.origin === 'string'
    ? req.headers.origin
    : undefined;
}

function getRequestHeaders(req: Request) {
  const requestHeaders = req.headers['access-control-request-headers'];

  return typeof requestHeaders === 'string'
    ? requestHeaders
    : DEFAULT_CORS_HEADERS;
}

function getAllowedResponseOrigin(requestOrigin?: string) {
  const corsOrigin = getCorsOrigin();

  if (corsOrigin === '*') {
    return '*';
  }

  if (!requestOrigin) {
    return undefined;
  }

  if (Array.isArray(corsOrigin)) {
    return corsOrigin.includes(requestOrigin) ? requestOrigin : undefined;
  }

  return corsOrigin === requestOrigin ? requestOrigin : undefined;
}

function corsHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const responseOrigin = getAllowedResponseOrigin(getRequestOrigin(req));

  if (responseOrigin) {
    res.setHeader('Access-Control-Allow-Origin', responseOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', CORS_METHODS);
  res.setHeader('Access-Control-Allow-Headers', getRequestHeaders(req));

  if (responseOrigin && responseOrigin !== '*') {
    res.setHeader('Vary', 'Origin');
  }

  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }

  next();
}

export function configureApp(app: INestApplication) {
  app.use(requestContextMiddleware);
  app.use(corsHeadersMiddleware);
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({
    origin: getCorsOrigin(),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
}
