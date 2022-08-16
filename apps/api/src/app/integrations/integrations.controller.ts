import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IJwtPayload, MemberRoleEnum } from '@novu/shared';
import { IntegrationEntity } from '@novu/dal';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { UserSession } from '../shared/framework/user.decorator';
import { CreateIntegration } from './usecases/create-integration/create-integration.usecase';
import { CreateIntegrationBodyDto } from './dto/create-integration.dto';
import { CreateIntegrationCommand } from './usecases/create-integration/create-integration.command';
import { GetIntegrations } from './usecases/get-integrations/get-integrations.usecase';
import { GetIntegrationsCommand } from './usecases/get-integrations/get-integrations.command';
import { Roles } from '../auth/framework/roles.decorator';
import { UpdateIntegrationBodyDto } from './dto/update-integration.dto';
import { UpdateIntegration } from './usecases/update-integration/update-integration.usecase';
import { UpdateIntegrationCommand } from './usecases/update-integration/update-integration.command';
import { RemoveIntegrationCommand } from './usecases/remove-integration/remove-integration.command';
import { RemoveIntegration } from './usecases/remove-integration/remove-integration.usecase';
import { GetActiveIntegrations } from './usecases/get-active-integration/get-active-integration.usecase';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

@Controller('/integrations')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Integrations')
@ApiExcludeController()
export class IntegrationsController {
  constructor(
    private getIntegrationsUsecase: GetIntegrations,
    private getActiveIntegrationsUsecase: GetActiveIntegrations,
    private createIntegrationUsecase: CreateIntegration,
    private updateIntegrationUsecase: UpdateIntegration,
    private removeIntegrationUsecase: RemoveIntegration
  ) {}

  @Get('/')
  async getIntegrations(@UserSession() user: IJwtPayload): Promise<IntegrationEntity[]> {
    return await this.getIntegrationsUsecase.execute(
      GetIntegrationsCommand.create({ environmentId: user.environmentId, organizationId: user.organizationId })
    );
  }

  @Get('/active')
  async getActiveIntegrations(@UserSession() user: IJwtPayload): Promise<IntegrationEntity[]> {
    return await this.getActiveIntegrationsUsecase.execute(
      GetIntegrationsCommand.create({ environmentId: user.environmentId, organizationId: user.organizationId })
    );
  }

  @Post('/')
  async createIntegration(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateIntegrationBodyDto
  ): Promise<IntegrationEntity> {
    return await this.createIntegrationUsecase.execute(
      CreateIntegrationCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        providerId: body.providerId,
        channel: body.channel,
        credentials: body.credentials,
        active: body.active,
      })
    );
  }

  @Put('/:integrationId')
  @Roles(MemberRoleEnum.ADMIN)
  updateIntegrationById(
    @UserSession() user: IJwtPayload,
    @Param('integrationId') integrationId: string,
    @Body() body: UpdateIntegrationBodyDto
  ) {
    return this.updateIntegrationUsecase.execute(
      UpdateIntegrationCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        integrationId,
        credentials: body.credentials,
        active: body.active,
      })
    );
  }

  @Delete('/:integrationId')
  async removeIntegration(@UserSession() user: IJwtPayload, @Param('integrationId') integrationId: string) {
    return await this.removeIntegrationUsecase.execute(
      RemoveIntegrationCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        integrationId,
      })
    );
  }
}
