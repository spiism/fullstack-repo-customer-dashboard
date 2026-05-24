type SstAppInput = {
  stage?: string;
};

type SstApiGatewayV2 = {
  url: string;
  route(path: string, args: Record<string, unknown>): void;
};

declare const $config: (config: {
  app(input?: SstAppInput): Record<string, unknown>;
  run(): Promise<Record<string, unknown>> | Record<string, unknown>;
}) => unknown;

declare const sst: {
  aws: {
    ApiGatewayV2: new (
      name: string,
      args?: Record<string, unknown>,
    ) => SstApiGatewayV2;
  };
};

declare const process: {
  env: Record<string, string | undefined>;
};

const SUPABASE_POOLER_HOST_SUFFIX = '.pooler.supabase.com';

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name}. Load apps/customer-api/.env before running SST.`,
    );
  }

  return value;
}

function isSupabasePoolerHost(hostname: string) {
  return (
    hostname === 'pooler.supabase.com' ||
    hostname.substring(
      hostname.length - SUPABASE_POOLER_HOST_SUFFIX.length,
    ) === SUPABASE_POOLER_HOST_SUFFIX
  );
}

function runtimeDatabaseUrl() {
  const value = requiredEnv('DATABASE_URL');
  const url = new URL(value);

  if (isSupabasePoolerHost(url.hostname)) {
    url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('connection_limit', '1');
  }

  return url.toString();
}

export default $config({
  app(input) {
    return {
      name: 'customer-dashboard',
      home: 'aws',
      providers: {
        aws: {
          region: process.env.AWS_REGION ?? 'ap-southeast-2',
        },
      },
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    };
  },
  async run() {
    const api = new sst.aws.ApiGatewayV2('CustomerApi', {
      cors: {
        // Demo only; restrict this before production.
        allowOrigins: ['*'],
        allowMethods: ['GET', 'OPTIONS'],
        allowHeaders: ['*'],
        exposeHeaders: [
          'x-request-id',
          'x-ratelimit-limit',
          'x-ratelimit-remaining',
          'x-ratelimit-reset',
        ],
        maxAge: '1 day',
      },
    });

    api.route('$default', {
      handler: 'apps/customer-api/src/lambda.handler',
      runtime: 'nodejs22.x',
      memory: '1024 MB',
      timeout: '30 seconds',
      copyFiles: [
        {
          from: 'apps/customer-api/node_modules/.prisma/client/',
          to: 'node_modules/.prisma/client/',
        },
      ],
      nodejs: {
        install: ['@prisma/client', 'serverless-http'],
        esbuild: {
          external: [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
          ],
        },
      },
      environment: {
        DATABASE_URL: runtimeDatabaseUrl(),
        DIRECT_URL: process.env.DIRECT_URL ?? requiredEnv('DATABASE_URL'),
        NODE_ENV: 'production',
        WEB_ORIGIN: process.env.WEB_ORIGIN ?? '*',
        THROTTLE_TTL: process.env.THROTTLE_TTL ?? '60000',
        THROTTLE_LIMIT: process.env.THROTTLE_LIMIT ?? '100',
      },
    });

    return {
      apiUrl: api.url,
    };
  },
});
