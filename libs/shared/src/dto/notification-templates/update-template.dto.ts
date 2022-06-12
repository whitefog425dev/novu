import { NotificationStepDto } from './notification-template.dto';

export interface IUpdateNotificationTemplate {
  name?: string;

  tags?: string[];

  description?: string;

  steps?: NotificationStepDto[];

  notificationGroupId?: string;
}
