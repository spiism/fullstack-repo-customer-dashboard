import { Controller, Get, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() query: ListCustomersQueryDto) {
    return this.customersService.findAll(query);
  }
}
