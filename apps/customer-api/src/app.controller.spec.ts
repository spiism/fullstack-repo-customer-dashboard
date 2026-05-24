import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_CUSTOMERS_ENDPOINT } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API status', () => {
      expect(appController.getStatus()).toEqual({
        name: 'Customer API',
        endpoints: {
          customers: DEFAULT_CUSTOMERS_ENDPOINT,
        },
      });
    });
  });
});
