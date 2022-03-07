import { Injectable } from '@nestjs/common';
import { IntegrationEntity, IntegrationRepository } from '@notifire/dal';
import { GetIntegrationsCommand } from './get-integrations.command';

@Injectable()
export class GetIntegrations {
  constructor(private integrationRepository: IntegrationRepository) {}

  async execute(command: GetIntegrationsCommand): Promise<IntegrationEntity[]> {
    return await this.integrationRepository.findByApplicationId(command.applicationId);
  }
}
