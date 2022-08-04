import { Injectable } from '@nestjs/common';
import {
  IEmailBlock,
  IntegrationRepository,
  MessageRepository,
  NotificationStepEntity,
  NotificationRepository,
  SubscriberEntity,
  SubscriberRepository,
  OrganizationRepository,
  MessageEntity,
  NotificationEntity,
  OrganizationEntity,
} from '@novu/dal';
import { ChannelTypeEnum, LogCodeEnum, LogStatusEnum } from '@novu/shared';
import * as Sentry from '@sentry/node';
import { IAttachmentOptions, IEmailOptions } from '@novu/stateless';
import { CreateLog } from '../../../logs/usecases/create-log/create-log.usecase';
import { CreateLogCommand } from '../../../logs/usecases/create-log/create-log.command';
import { CompileTemplate } from '../../../content-templates/usecases/compile-template/compile-template.usecase';
import { CompileTemplateCommand } from '../../../content-templates/usecases/compile-template/compile-template.command';
import { MailFactory } from '../../services/mail-service/mail.factory';
import { SendMessageCommand } from './send-message.command';
import { SendMessageType } from './send-message-type.usecase';

@Injectable()
export class SendMessageEmail extends SendMessageType {
  private mailFactory = new MailFactory();

  constructor(
    private subscriberRepository: SubscriberRepository,
    private notificationRepository: NotificationRepository,
    protected messageRepository: MessageRepository,
    protected createLogUsecase: CreateLog,
    private compileTemplate: CompileTemplate,
    private integrationRepository: IntegrationRepository,
    private organizationRepository: OrganizationRepository
  ) {
    super(messageRepository, createLogUsecase);
  }

  public async execute(command: SendMessageCommand) {
    const emailChannel: NotificationStepEntity = command.step;
    const notification = await this.notificationRepository.findById(command.notificationId);
    const subscriber: SubscriberEntity = await this.subscriberRepository.findOne({
      _environmentId: command.environmentId,
      _id: command.subscriberId,
    });
    const organization: OrganizationEntity = await this.organizationRepository.findById(command.organizationId);
    const email = command.payload.email || subscriber.email;

    Sentry.addBreadcrumb({
      message: 'Sending Email',
    });
    const isEditorMode = !emailChannel.template.contentType || emailChannel.template.contentType === 'editor';

    const subject = await this.renderContent(
      emailChannel.template.subject,
      emailChannel.template.subject,
      organization,
      subscriber,
      command
    );

    const content: string | IEmailBlock[] = await this.getContent(
      isEditorMode,
      emailChannel,
      command,
      subscriber,
      subject,
      organization
    );

    const messagePayload = Object.assign({}, command.payload);
    delete messagePayload.attachments;

    const message: MessageEntity = await this.messageRepository.create({
      _notificationId: command.notificationId,
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
      _subscriberId: command.subscriberId,
      _templateId: notification._templateId,
      _messageTemplateId: emailChannel.template._id,
      content,
      subject,
      channel: ChannelTypeEnum.EMAIL,
      transactionId: command.transactionId,
      email,
      payload: messagePayload,
      templateIdentifier: command.identifier,
    });

    const html = await this.compileTemplate.execute(
      CompileTemplateCommand.create({
        templateId: isEditorMode ? 'basic' : 'custom',
        customTemplate: emailChannel.template.contentType === 'customHtml' ? (content as string) : undefined,
        data: {
          subject,
          branding: {
            logo: organization.branding?.logo,
            color: organization.branding?.color || '#f47373',
          },
          blocks: isEditorMode ? content : [],
          step: {
            digest: !!command.events.length,
            events: command.events,
            total_count: command.events.length,
          },
          ...command.payload,
        },
      })
    );

    const integration = await this.integrationRepository.findOne({
      _environmentId: command.environmentId,
      channel: ChannelTypeEnum.EMAIL,
      active: true,
    });

    const attachments = (<IAttachmentOptions[]>command.payload.attachments)?.map(
      (attachment) =>
        <IAttachmentOptions>{
          file: Buffer.from(attachment.file),
          mime: attachment.mime,
          name: attachment.name,
          channels: attachment.channels,
        }
    );

    const mailData: IEmailOptions = {
      to: email,
      subject,
      html,
      from: command.payload.$sender_email || integration?.credentials.from || 'no-reply@novu.co',
      attachments,
    };

    if (email && integration) {
      await this.sendMessage(integration, mailData, message, command, notification);

      return;
    }
    await this.sendErrors(email, integration, message, command, notification);
  }

  private async sendErrors(
    email,
    integration,
    message: MessageEntity,
    command: SendMessageCommand,
    notification: NotificationEntity
  ) {
    const errorMessage = 'Subscriber does not have an';
    const status = 'warning';
    const errorId = 'mail_unexpected_error';

    if (!email) {
      const mailErrorMessage = `${errorMessage} email address`;

      await this.sendErrorStatus(
        message,
        status,
        errorId,
        mailErrorMessage,
        command,
        notification,
        LogCodeEnum.SUBSCRIBER_MISSING_EMAIL
      );
    }
    if (!integration) {
      const integrationError = `${errorMessage} active email integration not found`;

      await this.sendErrorStatus(
        message,
        status,
        errorId,
        integrationError,
        command,
        notification,
        LogCodeEnum.MISSING_EMAIL_INTEGRATION
      );
    }
  }

  private async sendMessage(
    integration,
    mailData,
    message: MessageEntity,
    command: SendMessageCommand,
    notification: NotificationEntity
  ) {
    const mailHandler = this.mailFactory.getHandler(integration, mailData.from);

    try {
      await mailHandler.send(mailData);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error?.response?.body || error?.response || error);
      this.messageRepository.updateMessageStatus(
        message._id,
        'error',
        error?.response?.body || error?.response || error,
        'mail_unexpected_error',
        'Error while sending email with provider'
      );
      await this.createLogUsecase.execute(
        CreateLogCommand.create({
          transactionId: command.transactionId,
          status: LogStatusEnum.ERROR,
          environmentId: command.environmentId,
          organizationId: command.organizationId,
          notificationId: notification._id,
          messageId: message._id,
          text: 'Error while sending email with provider',
          userId: command.userId,
          subscriberId: command.subscriberId,
          code: LogCodeEnum.MAIL_PROVIDER_DELIVERY_ERROR,
          templateId: notification._templateId,
          raw: {
            error: error?.response?.body || error?.response || error,
            payload: command.payload,
            triggerIdentifier: command.identifier,
          },
        })
      );
    }
  }

  private async getContent(
    isEditorMode,
    emailChannel,
    command: SendMessageCommand,
    subscriber: SubscriberEntity,
    subject,
    organization: OrganizationEntity
  ): Promise<string | IEmailBlock[]> {
    if (isEditorMode) {
      const content: IEmailBlock[] = [...emailChannel.template.content] as IEmailBlock[];
      for (const block of content) {
        /*
         * We need to trim the content in order to avoid mail provider like GMail
         * to display the mail with `[Message clipped]` footer.
         */
        block.content = await this.renderContent(block.content, subject, organization, subscriber, command);
        block.content = block.content.trim();
        block.url = await this.renderContent(block.url || '', subject, organization, subscriber, command);
      }

      return content;
    }

    return emailChannel.template.content;
  }

  private async renderContent(
    content: string,
    subject,
    organization: OrganizationEntity,
    subscriber,
    command: SendMessageCommand
  ) {
    return await this.compileTemplate.execute(
      CompileTemplateCommand.create({
        templateId: 'custom',
        customTemplate: content as string,
        data: {
          subject,
          branding: {
            logo: organization.branding?.logo,
            color: organization.branding?.color || '#f47373',
          },
          blocks: [],
          step: {
            digest: !!command.events.length,
            events: command.events,
            total_count: command.events.length,
          },
          subscriber,
          ...command.payload,
        },
      })
    );
  }
}
