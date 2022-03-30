import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { DalService } from '@novu/dal';
import { version } from '../../../package.json';

@Controller('health-check')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private healthIndicator: HttpHealthIndicator,
    private dalService: DalService
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      async () => {
        return {
          db: {
            status: this.dalService.connection.readyState === 1 ? 'up' : 'down',
          },
        };
      },
      async () => this.healthIndicator.pingCheck('dns', 'https://google.com'),
      async () => {
        return {
          apiVersion: {
            version,
            status: 'up',
          },
        };
      },
    ]);
  }
}
