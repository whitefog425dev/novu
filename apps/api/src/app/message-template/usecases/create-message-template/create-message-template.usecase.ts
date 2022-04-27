import { Injectable } from '@nestjs/common';
import { ChangeEntityTypeEnum, MessageTemplateEntity, MessageTemplateRepository } from '@novu/dal';
import { CreateMessageTemplateCommand } from './create-message-template.command';
import { sanitizeMessageContent } from '../../shared/sanitizer.service';
import { CreateChange } from '../../../change/usecases/create-change.usecase';
import { CreateChangeCommand } from '../../../change/usecases/create-change.command';
import { mongo } from 'mongoose';

@Injectable()
export class CreateMessageTemplate {
  constructor(private messageTemplateRepository: MessageTemplateRepository, private createChange: CreateChange) {}

  async execute(command: CreateMessageTemplateCommand): Promise<MessageTemplateEntity> {
    let item = await this.messageTemplateRepository.create({
      cta: command.cta,
      name: command.name,
      content: command.contentType === 'editor' ? sanitizeMessageContent(command.content) : command.content,
      contentType: command.contentType,
      subject: command.subject,
      type: command.type,
      _organizationId: command.organizationId,
      _environmentId: command.environmentId,
      _creatorId: command.userId,
    });

    item = await this.messageTemplateRepository.findById(item._id);

    await this.createChange.execute(
      CreateChangeCommand.create({
        organizationId: command.organizationId,
        environmentId: command.environmentId,
        userId: command.userId,
        item,
        type: ChangeEntityTypeEnum.MESSAGE_TEMPLATE,
        parentChangeId: command.parentChangeId,
        changeId: new mongo.ObjectID().toString(),
      })
    );

    return item;
  }
}
