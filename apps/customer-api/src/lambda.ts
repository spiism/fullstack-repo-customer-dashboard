import type { APIGatewayProxyEventV2, Callback, Context } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import serverless from 'serverless-http';
import { configureApp } from './app.configure';
import { AppModule } from './app.module';

type ServerlessHandler = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback,
) => Promise<unknown> | void;

let cachedHandler: ServerlessHandler | undefined;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as Express;
  return serverless(expressApp) as ServerlessHandler;
}

export const handler: ServerlessHandler = async (event, context, callback) => {
  cachedHandler ??= await bootstrap();
  return cachedHandler(event, context, callback);
};
