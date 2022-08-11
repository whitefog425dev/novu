import { Injectable } from '@nestjs/common';
import {
  MessageTemplateRepository,
  NotificationTemplateEntity,
  NotificationTemplateRepository,
  SubscriberPreferenceRepository,
} from '@novu/dal';
import { ChannelTypeEnum } from '@novu/stateless';
import { IPreferenceChannels } from '@novu/shared';
import {
  IGetSubscriberPreferenceTemplateResponse,
  ISubscriberPreferenceResponse,
} from '../get-subscriber-preference/get-subscriber-preference.usecase';
import { GetSubscriberTemplatePreferenceCommand } from './get-subscriber-template-preference.command';

@Injectable()
export class GetSubscriberTemplatePreference {
  constructor(
    private subscriberPreferenceRepository: SubscriberPreferenceRepository,
    private notificationTemplateRepository: NotificationTemplateRepository,
    private messageTemplateRepository: MessageTemplateRepository
  ) {}

  async execute(command: GetSubscriberTemplatePreferenceCommand): Promise<ISubscriberPreferenceResponse> {
    const activeChannels = await this.queryActiveChannels(command);
    const preferenceSettings = command.template.preferenceSettings ?? {
      email: true,
      sms: true,
      in_app: true,
      direct: true,
      push: true,
    };
    const templateDefaultsFiltered = getDefaultFromTemplate(activeChannels, preferenceSettings);

    const currSubscriberPreference = await this.subscriberPreferenceRepository.findOne({
      _environmentId: command.environmentId,
      _subscriberId: command.subscriberId,
      _templateId: command.template._id,
    });

    const responseTemplate = mapResponseTemplate(command.template);

    if (currSubscriberPreference) {
      return {
        template: responseTemplate,
        preference: {
          enabled: currSubscriberPreference.enabled,
          channels: filterActiveChannels(currSubscriberPreference?.channels ?? {}, templateDefaultsFiltered),
        },
      };
    }

    return getNoSettingFallback(responseTemplate, templateDefaultsFiltered);
  }

  private async queryActiveChannels(command: GetSubscriberTemplatePreferenceCommand): Promise<ChannelTypeEnum[]> {
    const messageIds = command.template.steps.filter((step) => step.active === true).map((step) => step._templateId);

    const messageTemplates = await this.messageTemplateRepository.find({
      _environmentId: command.environmentId,
      _id: {
        $in: messageIds,
      },
    });

    return [
      ...new Set(messageTemplates.map((messageTemplate) => messageTemplate.type) as unknown as ChannelTypeEnum[]),
    ];
  }
}

function getDefaultFromTemplate(activeChannels: ChannelTypeEnum[], defaults: IPreferenceChannels): IPreferenceChannels {
  const filteredChannels = Object.assign({}, defaults);
  for (const key in defaults) {
    if (!activeChannels.some((channel) => channel === key)) {
      delete filteredChannels[key];
    }
  }

  return filteredChannels;
}

function filterActiveChannels(channels: IPreferenceChannels, defaults: IPreferenceChannels): IPreferenceChannels {
  const filteredChannels = {};
  const channelsKeys = Object.keys(channels);

  for (const key in defaults) {
    if (!channelsKeys.some((channel) => channel === key)) {
      filteredChannels[key] = defaults[key];
    } else {
      filteredChannels[key] = channels[key];
    }
  }

  return filteredChannels;
}

function getNoSettingFallback(
  template: IGetSubscriberPreferenceTemplateResponse,
  defaults: IPreferenceChannels
): ISubscriberPreferenceResponse {
  return {
    template,
    preference: {
      enabled: true,
      channels: filterActiveChannels({}, defaults),
    },
  };
}

function mapResponseTemplate(template: NotificationTemplateEntity): IGetSubscriberPreferenceTemplateResponse {
  return {
    _id: template._id,
    name: template.name,
    critical: template.critical != null ? template.critical : true,
  };
}
