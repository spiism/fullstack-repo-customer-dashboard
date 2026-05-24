import { INestApplication, ValidationPipe } from '@nestjs/common';
import { API_PREFIX } from './app.constants';
import { requestContextMiddleware } from './common/middleware/request-context.middleware';

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

export function configureApp(app: INestApplication) {
  app.use(requestContextMiddleware);
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
