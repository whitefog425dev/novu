import { BuilderFieldOperator, BuilderFieldType, BuilderGroupValues } from '@novu/shared';
import { MessageTemplateEntity } from '../message-template';
import { NotificationGroupEntity } from '../notification-group';

export class NotificationTemplateEntity {
  _id?: string;

  name: string;

  description: string;

  active: boolean;

  draft: boolean;

  tags: string[];

  steps: NotificationStepEntity[];

  _organizationId: string;

  _creatorId: string;

  _environmentId: string;

  triggers: NotificationTriggerEntity[];

  _notificationGroupId: string;

  _parentId?: string;

  deleted: boolean;

  deletedAt: string;

  deletedBy: string;

  readonly notificationGroup?: NotificationGroupEntity;
}

export class NotificationTriggerEntity {
  type: 'event';

  identifier: string;

  variables: {
    name: string;
  }[];

  subscriberVariables?: {
    name: string;
  }[];
}

export class NotificationStepEntity {
  _id?: string;

  _templateId: string;

  active?: boolean;

  template?: MessageTemplateEntity;

  filters?: StepFilter[];

  _parentId?: string;
}

export class StepFilter {
  isNegated: boolean;

  type: BuilderFieldType;

  value: BuilderGroupValues;

  children: {
    field: string;
    value: string;
    operator: BuilderFieldOperator;
  }[];
}
