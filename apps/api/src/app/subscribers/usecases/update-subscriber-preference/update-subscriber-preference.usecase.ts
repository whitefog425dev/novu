import { Inject, Injectable } from '@nestjs/common';
import { SubscriberPreferenceEntity, SubscriberPreferenceRepository, NotificationTemplateRepository } from '@novu/dal';
import { UpdateSubscriberPreferenceCommand } from './update-subscriber-preference.command';
import { ApiException } from '../../../shared/exceptions/api.exception';
import { ISubscriberPreferenceResponse } from '../get-subscriber-preference/get-subscriber-preference.usecase';
import {
  GetSubscriberTemplatePreference,
  GetSubscriberTemplatePreferenceCommand,
} from '../get-subscriber-template-preference';
import { ANALYTICS_SERVICE } from '../../../shared/shared.module';
import { AnalyticsService } from '../../../shared/services/analytics/analytics.service';

@Injectable()
export class UpdateSubscriberPreference {
  constructor(
    private subscriberPreferenceRepository: SubscriberPreferenceRepository,
    private getSubscriberTemplatePreference: GetSubscriberTemplatePreference,
    private notificationTemplateRepository: NotificationTemplateRepository,
    @Inject(ANALYTICS_SERVICE) private analyticsService: AnalyticsService
  ) {}

  async execute(command: UpdateSubscriberPreferenceCommand): Promise<ISubscriberPreferenceResponse> {
    const userPreference = await this.subscriberPreferenceRepository.findOne({
      _organizationId: command.organizationId,
      _environmentId: command.environmentId,
      _subscriberId: command.subscriberId,
      _templateId: command.templateId,
    });

    if (!userPreference) {
      const channelObj = {} as Record<'email' | 'sms' | 'in_app' | 'chat' | 'push', boolean>;
      channelObj[command.channel?.type] = command.channel?.enabled;

      await this.subscriberPreferenceRepository.create({
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        _subscriberId: command.subscriberId,
        _templateId: command.templateId,
        enabled: command.enabled !== false,
        channels: command.channel?.type ? channelObj : null,
      });

      const template = await this.notificationTemplateRepository.findById(command.templateId, command.organizationId);

      const getSubscriberPreferenceCommand = GetSubscriberTemplatePreferenceCommand.create({
        organizationId: command.organizationId,
        subscriberId: command.subscriberId,
        environmentId: command.environmentId,
        template,
      });

      return await this.getSubscriberTemplatePreference.execute(getSubscriberPreferenceCommand);
    }

    const updatePayload: Partial<SubscriberPreferenceEntity> = {};

    if (command.enabled != null) {
      updatePayload.enabled = command.enabled;
    }

    if (command.channel?.type) {
      updatePayload[`channels.${command.channel.type}`] = command.channel.enabled;
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new ApiException('In order to make an update you need to provider channel or enabled');
    }

    await this.subscriberPreferenceRepository.update(
      {
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        _subscriberId: command.subscriberId,
        _templateId: command.templateId,
      },
      {
        $set: updatePayload,
      }
    );

    this.analyticsService.track('Update User Preference - [Notification Center]', command.organizationId, {
      _organization: command.organizationId,
      _template: command.templateId,
      ...updatePayload,
    });

    const template = await this.notificationTemplateRepository.findById(command.templateId, command.organizationId);

    const getSubscriberPreferenceCommand = GetSubscriberTemplatePreferenceCommand.create({
      organizationId: command.organizationId,
      subscriberId: command.subscriberId,
      environmentId: command.environmentId,
      template,
    });

    return await this.getSubscriberTemplatePreference.execute(getSubscriberPreferenceCommand);
  }
}
