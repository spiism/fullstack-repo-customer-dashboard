import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CustomersService } from './customers.service';

const customer = {
  id: 1,
  sourceId: 10,
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
};

describe('CustomersService', () => {
  let service: CustomersService;
  const prisma = {
    customer: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('returns paginated customers and metadata', async () => {
    prisma.customer.count.mockReturnValue('count-query');
    prisma.customer.findMany.mockReturnValue('find-query');
    prisma.$transaction.mockResolvedValue([25, [customer]]);

    await expect(service.findAll({ page: 2, limit: 10 })).resolves.toEqual({
      data: [
        {
          id: 1,
          sourceId: 10,
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
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });

    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      orderBy: {
        sourceId: 'asc',
      },
      skip: 10,
      take: 10,
    });
    expect(prisma.$transaction).toHaveBeenCalledWith([
      'count-query',
      'find-query',
    ]);
  });
});
