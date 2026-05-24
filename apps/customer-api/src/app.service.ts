import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Customer API',
      endpoints: {
        customers: '/customers?page=1&limit=10',
      },
    };
  }
}
