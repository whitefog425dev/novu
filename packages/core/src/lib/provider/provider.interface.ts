import { ChannelTypeEnum } from '../template/template.interface';

export interface IProvider {
  id: string;
  channelType: ChannelTypeEnum;
}

export interface IEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface ISmsOptions {
  to: string;
  content: string;
  from?: string;
}

export interface IEmailProvider extends IProvider {
  channelType: ChannelTypeEnum.EMAIL;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage(options: IEmailOptions): Promise<any>;
}

export interface ISmsProvider extends IProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage(options: ISmsOptions): Promise<any>;

  channelType: ChannelTypeEnum.SMS;
}
