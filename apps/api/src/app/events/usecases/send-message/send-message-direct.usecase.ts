import { Injectable } from '@nestjs/common';
import { SendMessageType } from './send-message-type.usecase';
import { DirectFactory } from '../../services/direct-service/direct.factory';
import { CreateLog } from '../../../logs/usecases/create-log/create-log.usecase';
import { SendMessageCommand } from './send-message.command';
import * as Sentry from '@sentry/node';
import {
  IntegrationRepository,
  NotificationRepository,
  NotificationStepEntity,
  SubscriberEntity,
  SubscriberRepository,
  MessageRepository,
  MessageEntity,
  IChannelSettings,
  NotificationEntity,
} from '@novu/dal';
import { ChannelTypeEnum, LogCodeEnum, LogStatusEnum } from '@novu/shared';
import { ContentService } from '../../../shared/helpers/content.service';
import { CreateLogCommand } from '../../../logs/usecases/create-log/create-log.command';
import { DirectProviderIdEnum } from '@novu/dal';

@Injectable()
export class SendMessageDirect extends SendMessageType {
  private directFactory = new DirectFactory();

  constructor(
    private subscriberRepository: SubscriberRepository,
    private notificationRepository: NotificationRepository,
    protected messageRepository: MessageRepository,
    protected createLogUsecase: CreateLog,
    private integrationRepository: IntegrationRepository
  ) {
    super(messageRepository, createLogUsecase);
  }

  public async execute(command: SendMessageCommand) {
    Sentry.addBreadcrumb({
      message: 'Sending Direct',
    });
    const directChannel: NotificationStepEntity = command.step;
    const notification = await this.notificationRepository.findById(command.notificationId);
    const subscriber: SubscriberEntity = await this.subscriberRepository.findOne({
      _environmentId: command.environmentId,
      _id: command.subscriberId,
    });
    const contentService = new ContentService();
    const messageVariables = contentService.buildMessageVariables(command.payload, subscriber);
    const content = contentService.replaceVariables(directChannel.template.content as string, messageVariables);

    const directChannels = subscriber.channels.filter((chan) =>
      Object.values(DirectProviderIdEnum).includes(chan.providerId)
    );

    for (const channel of directChannels) {
      await this.sendChannelMessage(command, channel, notification, directChannel, content);
    }
  }

  private async sendChannelMessage(
    command: SendMessageCommand,
    subscriberChannel,
    notification,
    directChannel,
    content: string
  ) {
    const directChannelId = command.payload.channelId || subscriberChannel.credentials.channelId;

    const message: MessageEntity = await this.messageRepository.create({
      _notificationId: notification._id,
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
      _subscriberId: command.subscriberId,
      _templateId: notification._templateId,
      _messageTemplateId: directChannel.template._id,
      channel: ChannelTypeEnum.SMS,
      transactionId: command.transactionId,
      directChannelId,
      content,
    });

    const integration = await this.integrationRepository.findOne({
      _environmentId: command.environmentId,
      providerId: subscriberChannel.integrationId,
      channel: ChannelTypeEnum.DIRECT,
      active: true,
    });

    if (directChannelId && integration) {
      await this.sendMessage(directChannelId, integration, content, message, command, notification, subscriberChannel);

      return;
    }

    await this.sendErrors(directChannelId, integration, message, command, notification);
  }

  private async sendErrors(
    directChannelId,
    integration,
    message: MessageEntity,
    command: SendMessageCommand,
    notification: NotificationEntity
  ) {
    if (!directChannelId) {
      await this.createLogUsecase.execute(
        CreateLogCommand.create({
          transactionId: command.transactionId,
          status: LogStatusEnum.ERROR,
          environmentId: command.environmentId,
          organizationId: command.organizationId,
          text: 'Subscriber does not have active direct channel Id',
          userId: command.userId,
          subscriberId: command.subscriberId,
          code: LogCodeEnum.SUBSCRIBER_MISSING_DIRECT_CHANNEL_ID,
          templateId: notification._templateId,
          raw: {
            payload: command.payload,
            triggerIdentifier: command.identifier,
          },
        })
      );
      await this.messageRepository.updateMessageStatus(
        message._id,
        'warning',
        null,
        'no_subscriber_direct_channel_id',
        'Subscriber does not have active direct channel id'
      );
    }
    if (!integration) {
      await this.sendErrorStatus(
        message,
        'warning',
        'direct_missing_integration_error',
        'Subscriber does not have an active direct integration',
        command,
        notification,
        LogCodeEnum.MISSING_SMS_INTEGRATION
      );
    }
  }

  private async sendMessage(
    directChannelId,
    integration,
    content,
    message: MessageEntity,
    command: SendMessageCommand,
    notification: NotificationEntity,
    directChannel: IChannelSettings
  ) {
    try {
      const directHandler = this.directFactory.getHandler(integration);

      await directHandler.send({
        channelId: directChannelId,
        content,
        accessToken: directChannel.credentials.accessToken,
      });
    } catch (e) {
      await this.createLogUsecase.execute(
        CreateLogCommand.create({
          transactionId: command.transactionId,
          status: LogStatusEnum.ERROR,
          environmentId: command.environmentId,
          organizationId: command.organizationId,
          text: e.message || e.name || 'Un-expect DIRECT provider error',
          userId: command.userId,
          code: LogCodeEnum.DIRECT_ERROR,
          templateId: notification._templateId,
          raw: {
            payload: command.payload,
            triggerIdentifier: command.identifier,
          },
        })
      );

      await this.messageRepository.updateMessageStatus(
        message._id,
        'error',
        e,
        'unexpected_direct_error',
        e.message || e.name || 'Un-expect DIRECT provider error'
      );
    }
  }
}
