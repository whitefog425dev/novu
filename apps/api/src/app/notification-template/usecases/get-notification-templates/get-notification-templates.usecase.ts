import { Injectable } from '@nestjs/common';
import { NotificationTemplateEntity, NotificationTemplateRepository, OrganizationEntity } from '@novu/dal';
import { GetNotificationTemplatesCommand } from './get-notification-templates.command';
import { NotificationTemplatesResponseDto } from '../../dto/notification-templates.response.dto';
@Injectable()
export class GetNotificationTemplates {
  constructor(private notificationTemplateRepository: NotificationTemplateRepository) {}

  async execute(command: GetNotificationTemplatesCommand): Promise<NotificationTemplatesResponseDto> {
    const LIMIT = 10;

    const { data: list, totalCount } = await this.notificationTemplateRepository.getList(
      command.organizationId,
      command.environmentId,
      command.page * LIMIT,
      LIMIT,
      command.usePagination
    );

    return { page: command.page, data: list, totalCount, pageSize: command.usePagination ? LIMIT : totalCount };
  }
}
