import { Inject, Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';

type CustomerResponse = {
  id: number;
  sourceId: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  gender: string | null;
  ipAddress: string | null;
  company: string | null;
  city: string | null;
  title: string | null;
  website: string | null;
};

@Injectable()
export class CustomersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(query: ListCustomersQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const queryFilter = this.getQueryFilter(query.search);
    const countArgs: Prisma.CustomerCountArgs = queryFilter
      ? { where: queryFilter }
      : {};
    const findManyArgs: Prisma.CustomerFindManyArgs = {
      ...(queryFilter ? { where: queryFilter } : {}),
      orderBy: {
        sourceId: 'asc',
      },
      skip,
      take: limit,
    };
    const [total, customers] = await this.prisma.$transaction([
      this.prisma.customer.count(countArgs),
      this.prisma.customer.findMany(findManyArgs),
    ]);

    return {
      data: customers.map((customer) => this.toResponse(customer)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private getQueryFilter(
    search?: string,
  ): Prisma.CustomerWhereInput | undefined {
    if (!search) {
      return undefined;
    }

    return {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  private toResponse(customer: Customer): CustomerResponse {
    return {
      id: customer.id,
      sourceId: customer.sourceId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      gender: customer.gender,
      ipAddress: customer.ipAddress,
      company: customer.company,
      city: customer.city,
      title: customer.title,
      website: customer.website,
    };
  }
}
