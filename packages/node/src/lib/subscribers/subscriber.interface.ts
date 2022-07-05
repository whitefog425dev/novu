import { IChannelCredentials } from '@novu/shared';

export interface ISubscribers {
  identify(subscriberId: string, data: ISubscriberPayload);
  update(subscriberId: string, data: ISubscriberPayload);
  delete(subscriberId: string);
  setCredentials(
    subscriberId: string,
    integrationId: string,
    credentials: IChannelCredentials
  );
}

export interface ISubscriberPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  noficationIdentifiers?: string[];
  [key: string]: string | string[] | boolean | number | undefined;
}

export interface ISubscribersDefine extends ISubscriberPayload {
  subscriberId: string;
}

export enum ChannelTypeEnum {
  EMAIL = 'email',
  SMS = 'sms',
  DIRECT = 'direct',
  PUSH = 'push',
}

export type TriggerRecipientsTypeArray = string[] | ISubscribersDefine[];

export type TriggerRecipientsTypeSingle = string | ISubscribersDefine;

export type TriggerRecipientsType =
  | TriggerRecipientsTypeSingle
  | TriggerRecipientsTypeArray;

export interface ITriggerPayloadOptions {
  payload: ITriggerPayload;
  overrides?: ITriggerOverrides;
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

export type ITriggerOverrides = {
  [key in
    | 'emailjs'
    | 'mailgun'
    | 'nodemailer'
    | 'plivo'
    | 'postmark'
    | 'sendgrid'
    | 'twilio']: object;
} & {
  [key in 'fcm']: ITriggerOverrideFCM;
};

export type ITriggerOverrideFCM = {
  tag?: string;
  body?: string;
  icon?: string;
  badge?: string;
  color?: string;
  sound?: string;
  title?: string;
  bodyLocKey?: string;
  bodyLocArgs?: string;
  clickAction?: string;
  titleLocKey?: string;
  titleLocArgs?: string;
};
export interface IAttachmentOptions {
  mime: string;
  file: Buffer;
  name?: string;
  channels?: ChannelTypeEnum[];
}
