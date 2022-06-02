import { BuilderFieldOperator, BuilderFieldType, BuilderGroupValues } from '../../types/builder/builder.types';
import { IMessageTemplate } from '../message-template';

export interface INotificationTemplate {
  _id?: string;
  name: string;
  description?: string;
  _notificationGroupId: string;
  _parentId?: string;
  _environmentId: string;
  tags: string[];
  draft: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  steps: INotificationTemplateStep[];
  triggers: INotificationTrigger[];
}

export enum TriggerTypeEnum {
  EVENT = 'event',
}

export interface INotificationTrigger {
  type: TriggerTypeEnum;
  identifier: string;
  variables: { name: string }[];
  subscriberVariables?: { name: string }[];
}

export interface INotificationTemplateStep {
  _id?: string;
  filters?: IMessageFilter[];
  _templateId?: string;
  template: IMessageTemplate;
  _parentId?: string;
}

export interface IMessageFilter {
  isNegated?: boolean;
  type: BuilderFieldType;
  value: BuilderGroupValues;
  children: {
    field: string;
    value: string;
    operator: BuilderFieldOperator;
  }[];
}
