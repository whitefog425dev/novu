import { Injectable } from '@nestjs/common';
import {
  MessageRepository,
  NotificationStepEntity,
  NotificationRepository,
  SubscriberRepository,
  SubscriberEntity,
  IEmailBlock,
} from '@novu/dal';
import { ChannelTypeEnum, LogCodeEnum, LogStatusEnum, IMessageButton } from '@novu/shared';
import * as Sentry from '@sentry/node';
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
    const content = await this.compileInAppTemplate(inAppChannel.template.content, command.payload, subscriber);

    if (inAppChannel.template.cta?.data?.url) {
      inAppChannel.template.cta.data.url = await this.compileInAppTemplate(
        inAppChannel.template.cta?.data?.url,
        command.payload,
        subscriber
      );
    }

    if (inAppChannel.template.cta?.action?.buttons) {
      const testButtons: IMessageButton[] = [];
      for (const action of inAppChannel.template.cta.action.buttons) {
        const tmpContent = await this.compileInAppTemplate(action.content, command.payload, subscriber);
        testButtons.push({ type: action.type, content: tmpContent });
      }

      inAppChannel.template.cta.action.buttons = testButtons;
    }

    const messagePayload = Object.assign({}, command.payload);
    delete messagePayload.attachments;

    const message = await this.messageRepository.create({
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
      templateIdentifier: command.identifier,
    });

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

  private async compileInAppTemplate(content: string | IEmailBlock[], payload: any, subscriber: SubscriberEntity) {
    return await this.compileTemplate.execute(
      CompileTemplateCommand.create({
        templateId: 'custom',
        customTemplate: content as string,
        data: {
          subscriber,
          ...payload,
        },
      })
    );
  }
}
