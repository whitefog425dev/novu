import { IChannelCredentials } from '@novu/shared';

export interface ISubscribers {
  identify(subscriberId: string, data: ISubscriberPayload);
  update(subscriberId: string, data: ISubscriberPayload);
  delete(subscriberId: string);
  setCredentials(
    subscriberId: string,
    providerId: string,
    credentials: IChannelCredentials
  );
}

export interface ISubscriberPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: string | string[] | boolean | number | undefined;
}

export interface ISubscribersDefine extends ISubscriberPayload {
  subscriberId: string;
}

export enum ChannelTypeEnum {
  EMAIL = 'email',
  SMS = 'sms',
  DIRECT = 'direct',
}

export type TriggerRecipientsTypeArray = string[] | ISubscribersDefine[];

export type TriggerRecipientsTypeSingle = string | ISubscribersDefine;

export type TriggerRecipientsType =
  | TriggerRecipientsTypeSingle
  | TriggerRecipientsTypeArray;

export interface ITriggerPayloadOptions {
  payload: ITriggerPayload;
  to: TriggerRecipientsType;
}

export interface ITriggerPayload {
  attachments?: IAttachmentOptions[];
  [key: string]:
    | string
    | string[]
    | boolean
    | number
    | undefined
    | IAttachmentOptions
    | IAttachmentOptions[]
    | Record<string, unknown>;
}

export interface IAttachmentOptions {
  mime: string;
  file: Buffer;
  name?: string;
  channels?: ChannelTypeEnum[];
}
