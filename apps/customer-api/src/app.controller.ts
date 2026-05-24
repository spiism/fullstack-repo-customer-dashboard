import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    // Explicit token keeps DI stable in esbuild Lambda bundles.
    @Inject(AppService)
    private readonly appService: AppService,
  ) {}

  @Get()
  getStatus() {
    return this.appService.getStatus();
  }
}
