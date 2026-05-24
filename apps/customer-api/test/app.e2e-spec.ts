import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
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
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({
        name: 'Customer API',
        endpoints: {
          customers: '/customers?page=1&limit=10',
        },
      });
  });

  it('/customers (GET)', async () => {
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
      .get('/customers?page=1&limit=10')
      .expect(200)
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

  it('/customers rejects invalid pagination', () => {
    return request(app.getHttpServer())
      .get('/customers?page=0&limit=500')
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
