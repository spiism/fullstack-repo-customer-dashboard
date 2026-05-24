import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto';
import { ListCustomersQueryPipe } from './pipes/list-customers-query.pipe';

@Controller('customers')
export class CustomersController {
  constructor(
    @Inject(CustomersService)
    private readonly customersService: CustomersService,
  ) {}

  @Get()
  findAll(@Query(new ListCustomersQueryPipe()) query: ListCustomersQueryDto) {
    return this.customersService.findAll(query);
  }
}
