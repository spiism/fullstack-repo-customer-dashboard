import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';

type CustomerResponse = {
  id: number;
  sourceId: number;
  firstName: string;
  lastName: string;
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
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListCustomersQueryDto) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const [total, customers] = await this.prisma.$transaction([
      this.prisma.customer.count(),
      this.prisma.customer.findMany({
        orderBy: {
          sourceId: 'asc',
        },
        skip,
        take: limit,
      }),
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
