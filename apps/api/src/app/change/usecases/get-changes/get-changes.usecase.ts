import { Injectable, Logger } from '@nestjs/common';
import {
  ChangeEntity,
  ChangeEntityTypeEnum,
  ChangeRepository,
  MessageTemplateRepository,
  NotificationGroupRepository,
  NotificationTemplateRepository,
} from '@novu/dal';
import { GetChangesCommand } from './get-changes.command';

interface IViewEntity {
  templateName: string;
  templateId?: string;
  messageType?: string;
}

interface IChangeViewEntity extends ChangeEntity {
  templateName?: string;
  templateId?: string;
  messageType?: string;
}

@Injectable()
export class GetChanges {
  constructor(
    private changeRepository: ChangeRepository,
    private notificationTemplateRepository: NotificationTemplateRepository,
    private messageTemplateRepository: MessageTemplateRepository,
    private notificationGroupRepository: NotificationGroupRepository
  ) {}

  async execute(command: GetChangesCommand): Promise<IChangeViewEntity[]> {
    const changes: ChangeEntity[] = await this.changeRepository.getList(
      command.organizationId,
      command.environmentId,
      command.promoted
    );

    return await changes.reduce(async (prev, change) => {
      const list = await prev;
      let item: Record<string, unknown> | IViewEntity = {};
      if (change.type === ChangeEntityTypeEnum.MESSAGE_TEMPLATE) {
        item = await this.getTemplateDataForMessageTemplate(change._entityId, command.environmentId);
      }
      if (change.type === ChangeEntityTypeEnum.NOTIFICATION_TEMPLATE) {
        item = await this.getTemplateDataForNotificationTemplate(change._entityId, command.environmentId);
      }
      if (change.type === ChangeEntityTypeEnum.NOTIFICATION_GROUP) {
        item = await this.getTemplateDataForNotificationGroup(change._entityId, command.environmentId);
      }

      list.push({
        ...change,
        ...item,
      });

      return list;
    }, Promise.resolve([]));
  }

  private async getTemplateDataForMessageTemplate(
    entityId: string,
    environmentId: string
  ): Promise<IViewEntity | Record<string, unknown>> {
    const item = await this.notificationTemplateRepository.findOne({
      _environmentId: environmentId,
      'steps._templateId': entityId,
    });

    if (!item) {
      Logger.error(`Could not find notification template for template id ${entityId}`);

      return {};
    }

    const message = await this.messageTemplateRepository.findOne({
      _environmentId: environmentId,
      _id: entityId,
    });

    return {
      templateId: item._id,
      templateName: item.name,
      messageType: message?.type,
    };
  }

  private async getTemplateDataForNotificationTemplate(
    entityId: string,
    environmentId: string
  ): Promise<IViewEntity | Record<string, unknown>> {
    const item = await this.notificationTemplateRepository.findOne({
      _environmentId: environmentId,
      _id: entityId,
    });

    if (!item) {
      Logger.error(`Could not find notification template for template id ${entityId}`);

      return {};
    }

    return {
      templateId: item._id,
      templateName: item.name,
    };
  }

  private async getTemplateDataForNotificationGroup(
    entityId: string,
    environmentId: string
  ): Promise<IViewEntity | Record<string, unknown>> {
    const item = await this.notificationGroupRepository.findOne({
      _environmentId: environmentId,
      _id: entityId,
    });

    if (!item) {
      Logger.error(`Could not find notification group for id ${entityId}`);

      return {};
    }

    return {
      templateName: item.name,
    };
  }
}
