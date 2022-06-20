import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ISmsOptions,
  ISmsProvider,
} from '@novu/stateless';
import { SmsParams, MessageChannel, SmsJsonResponse, AnyObject } from '../types/sms';

if (!globalThis.fetch) {
  // eslint-disable-next-line global-require
  globalThis.fetch = require('node-fetch');
}

export * from '../types/sms';

export class TermiiSmsProvider implements ISmsProvider {
  public static readonly BASE_URL = 'https://api.ng.termii.com/api/sms/send';
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  id='termii';

  constructor(
    private config: {
      apiKey: string;
      from?: string;
      channel: MessageChannel;
    }
  ) {
  }

  async sendMessage(
    options: ISmsOptions
  ): Promise<ISendMessageSuccessResponse> {
    const params: SmsParams = {
      to: options.to,
      from: options.from || this.config.from,
      sms: options.content,
      type: 'plain',
      channel: this.config.channel,
      api_key: this.config.apiKey,
    };

    const opts: AnyObject = {
      method: 'POST',
      headers: {
        'Content-Type': ['application/json'],
      },
      body: JSON.stringify(params)
    }

    const response = await fetch(TermiiSmsProvider.BASE_URL, opts)
    const body = await response.json() as SmsJsonResponse;

    return {
      id: body.message_id,
      date: new Date().toISOString()
    };
  }
}