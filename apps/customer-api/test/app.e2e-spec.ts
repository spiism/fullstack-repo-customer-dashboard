import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.configure';
import { DEFAULT_CUSTOMERS_ENDPOINT } from './../src/app.constants';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Customer API (e2e)', () => {
  let app: INestApplication<App>;
  const prisma = {
    customer: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('x-request-id', /.+/)
      .expect({
        name: 'Customer API',
        endpoints: {
          customers: DEFAULT_CUSTOMERS_ENDPOINT,
        },
      });
  });

  it('/api/v1/customers (GET)', async () => {
    prisma.customer.count.mockReturnValue('count-query');
    prisma.customer.findMany.mockReturnValue('find-query');
    prisma.$transaction.mockResolvedValue([
      1,
      [
        {
          id: 1,
          sourceId: 1,
          firstName: 'Laura',
          lastName: 'Richards',
          email: 'laura@example.com',
          gender: 'Female',
          ipAddress: '81.192.7.99',
          company: 'Meezzy',
          city: 'Kallithea',
          title: 'Biostatistician III',
          website: 'https://example.com',
          createdAt: new Date('2026-01-01T00:00:00Z'),
          updatedAt: new Date('2026-01-01T00:00:00Z'),
        },
      ],
    ]);

    await request(app.getHttpServer())
      .get('/api/v1/customers?page=1&limit=10')
      .set('Origin', 'http://localhost:3000')
      .expect(200)
      .expect('access-control-allow-origin', '*')
      .expect({
        data: [
          {
            id: 1,
            sourceId: 1,
            firstName: 'Laura',
            lastName: 'Richards',
            email: 'laura@example.com',
            gender: 'Female',
            ipAddress: '81.192.7.99',
            company: 'Meezzy',
            city: 'Kallithea',
            title: 'Biostatistician III',
            website: 'https://example.com',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      orderBy: {
        sourceId: 'asc',
      },
      skip: 0,
      take: 10,
    });
  });

  it('/api/v1/customers filters by search term', async () => {
    prisma.customer.count.mockReturnValue('count-query');
    prisma.customer.findMany.mockReturnValue('find-query');
    prisma.$transaction.mockResolvedValue([0, []]);

    await request(app.getHttpServer())
      .get('/api/v1/customers?page=1&limit=10&search=Laura')
      .expect(200);

    expect(prisma.customer.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { firstName: { contains: 'Laura', mode: 'insensitive' } },
          { lastName: { contains: 'Laura', mode: 'insensitive' } },
          { email: { contains: 'Laura', mode: 'insensitive' } },
          { company: { contains: 'Laura', mode: 'insensitive' } },
          { city: { contains: 'Laura', mode: 'insensitive' } },
          { title: { contains: 'Laura', mode: 'insensitive' } },
        ],
      },
    });
  });

  it('/api/v1/customers rejects invalid pagination', () => {
    return request(app.getHttpServer())
      .get('/api/v1/customers?page=0&limit=500')
      .expect(400);
  });

  it('/api/v1/customers handles CORS preflight', () => {
    return request(app.getHttpServer())
      .options('/api/v1/customers')
      .set('Origin', 'https://customer-web.example')
      .set('Access-Control-Request-Method', 'GET')
      .expect(204)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', 'GET,OPTIONS');
  });

  afterEach(async () => {
    await app.close();
  });
});
