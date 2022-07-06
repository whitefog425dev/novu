import { Injectable } from '@nestjs/common';
import {
  MessageRepository,
  NotificationStepEntity,
  NotificationRepository,
  SubscriberRepository,
  SubscriberEntity,
} from '@novu/dal';
import { ChannelTypeEnum, LogCodeEnum, LogStatusEnum } from '@novu/shared';
import * as Sentry from '@sentry/node';
import { ContentService } from '../../../shared/helpers/content.service';
import { CreateLog } from '../../../logs/usecases/create-log/create-log.usecase';
import { CreateLogCommand } from '../../../logs/usecases/create-log/create-log.command';
import { QueueService } from '../../../shared/services/queue';
import { SendMessageCommand } from './send-message.command';
import { SendMessageType } from './send-message-type.usecase';
import { CompileTemplate } from '../../../content-templates/usecases/compile-template/compile-template.usecase';
import { CompileTemplateCommand } from '../../../content-templates/usecases/compile-template/compile-template.command';

@Injectable()
export class SendMessageInApp extends SendMessageType {
  constructor(
    private notificationRepository: NotificationRepository,
    protected messageRepository: MessageRepository,
    private queueService: QueueService,
    protected createLogUsecase: CreateLog,
    private subscriberRepository: SubscriberRepository,
    private compileTemplate: CompileTemplate
  ) {
    super(messageRepository, createLogUsecase);
  }

  public async execute(command: SendMessageCommand) {
    Sentry.addBreadcrumb({
      message: 'Sending In App',
    });
    const notification = await this.notificationRepository.findById(command.notificationId);
    const subscriber: SubscriberEntity = await this.subscriberRepository.findOne({
      _environmentId: command.environmentId,
      _id: command.subscriberId,
    });
    const inAppChannel: NotificationStepEntity = command.step;
    const contentService = new ContentService();
    const content = await this.compileTemplate.execute(
      CompileTemplateCommand.create({
        templateId: 'custom',
        customTemplate: inAppChannel.template.content as string,
        data: {
          subscriber,
          step: {
            events: command.events,
            total_count: command.events.length,
          },
          ...command.payload,
        },
      })
    );

    if (inAppChannel.template.cta?.data?.url) {
      const messageVariables = contentService.buildMessageVariables(command.payload, subscriber);
      inAppChannel.template.cta.data.url = contentService.replaceVariables(
        inAppChannel.template.cta?.data?.url,
        messageVariables
      );
    }

    const messagePayload = Object.assign({}, command.payload);
    delete messagePayload.attachments;

    const oldMessage = await this.messageRepository.findOne({
      _notificationId: notification._id,
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
      _subscriberId: command.subscriberId,
      _templateId: notification._templateId,
      _messageTemplateId: inAppChannel.template._id,
      channel: ChannelTypeEnum.IN_APP,
      transactionId: command.transactionId,
    });

    let message;

    if (!oldMessage) {
      message = await this.messageRepository.create({
        _notificationId: notification._id,
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
        _subscriberId: command.subscriberId,
        _templateId: notification._templateId,
        _messageTemplateId: inAppChannel.template._id,
        channel: ChannelTypeEnum.IN_APP,
        cta: inAppChannel.template.cta,
        transactionId: command.transactionId,
        content,
        payload: messagePayload,
      });
    }

    if (oldMessage) {
      await this.messageRepository.update(
        {
          _id: oldMessage._id,
        },
        {
          $set: {
            seen: false,
            cta: inAppChannel.template.cta,
            content,
            payload: messagePayload,
            createdAt: new Date(),
          },
        }
      );
      message = this.messageRepository.findById(oldMessage._id);
    }

    const count = await this.messageRepository.getUnseenCount(
      command.environmentId,
      command.subscriberId,
      ChannelTypeEnum.IN_APP
    );

    await this.createLogUsecase.execute(
      CreateLogCommand.create({
        transactionId: command.transactionId,
        status: LogStatusEnum.SUCCESS,
        environmentId: command.environmentId,
        organizationId: command.organizationId,
        notificationId: notification._id,
        messageId: message._id,
        text: 'In App message created',
        userId: command.userId,
        subscriberId: command.subscriberId,
        code: LogCodeEnum.IN_APP_MESSAGE_CREATED,
        templateId: notification._templateId,
        raw: {
          payload: command.payload,
          triggerIdentifier: command.identifier,
        },
      })
    );

    await this.queueService.wsSocketQueue.add({
      event: 'unseen_count_changed',
      userId: command.subscriberId,
      payload: {
        unseenCount: count,
      },
    });
  }
}
