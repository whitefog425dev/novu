export interface ITemplate {
  id: string;

  themeId?: string;

  messages: IMessage[];
}

export interface IMessageValidator {
  validate(payload: ITriggerPayload): Promise<boolean> | boolean;
}

export interface IMessage {
  subject?: string | ((config: ITriggerPayload) => string);
  providerId?: string;
  channel: ChannelTypeEnum;
  template: string | ((payload: ITriggerPayload) => Promise<string> | string);
  // used to provide a text version in emails
  textTemplate?:
    | string
    | ((payload: ITriggerPayload) => Promise<string> | string);
  active?: boolean | ((payload: ITriggerPayload) => Promise<boolean> | boolean);
  validator?: IMessageValidator;
}

export enum ChannelTypeEnum {
  EMAIL = 'email',
  SMS = 'sms',
  DIRECT = 'direct',
}

export interface ITriggerPayload {
  $email?: string;
  $phone?: string;
  $user_id: string;
  $theme_id?: string;
  $channel_id?: string;
  $attachments?: IAttachmentOptions[];
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
