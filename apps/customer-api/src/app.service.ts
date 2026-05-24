import { Injectable } from '@nestjs/common';
import { DEFAULT_CUSTOMERS_ENDPOINT } from './app.constants';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Customer API',
      endpoints: {
        customers: DEFAULT_CUSTOMERS_ENDPOINT,
      },
    };
  }
}
