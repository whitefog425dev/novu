import {
  ChannelTypeEnum,
  IAttachmentOptions,
} from '../template/template.interface';

export interface IProvider {
  id: string;
  channelType: ChannelTypeEnum;
}

export interface IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  attachments?: IAttachmentOptions[];
}

export interface ISmsOptions {
  to: string;
  content: string;
  from?: string;
  attachments?: IAttachmentOptions[];
}

export interface IPushOptions {
  target: string;
  title: string;
  content: string;
  payload?: object;
}

export interface IDirectOptions {
  channelId: string;
  content: string;
}

export interface ISendMessageSuccessResponse {
  id?: string;
  date?: string;
}

export interface IEmailProvider extends IProvider {
  channelType: ChannelTypeEnum.EMAIL;

  sendMessage(options: IEmailOptions): Promise<ISendMessageSuccessResponse>;
}

export interface ISmsProvider extends IProvider {
  sendMessage(options: ISmsOptions): Promise<ISendMessageSuccessResponse>;

  channelType: ChannelTypeEnum.SMS;
}

export interface IDirectProvider extends IProvider {
  sendMessage(options: IDirectOptions): Promise<ISendMessageSuccessResponse>;

  channelType: ChannelTypeEnum.DIRECT;
}

export interface IPushProvider extends IProvider {
  sendMessage(options: IPushOptions): Promise<ISendMessageSuccessResponse>;

  channelType: ChannelTypeEnum.PUSH;
}
