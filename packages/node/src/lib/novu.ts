import axios, { AxiosInstance } from 'axios';
import { Subscribers } from './subscribers/subscribers';
import { EventEmitter } from 'events';
import { INovu, INovuConfiguration } from './novu.interface';
import { ITriggerPayloadOptions } from '@novu/shared';

export class Novu extends EventEmitter implements INovu {
  private readonly apiKey?: string;
  private readonly http: AxiosInstance;
  readonly subscribers: Subscribers;

  constructor(apiKey: string, config?: INovuConfiguration) {
    super();
    this.apiKey = apiKey;

    this.http = axios.create({
      baseURL: this.buildBackendUrl(config),
      headers: {
        Authorization: `ApiKey ${this.apiKey}`,
      },
    });

    this.subscribers = new Subscribers(this.http);
  }

  async trigger(eventId: string, data: ITriggerPayloadOptions) {
    return await this.http.post(`/events/trigger`, {
      name: eventId,
      to: data.to,
      payload: {
        ...data?.payload,
      },
      overrides: data.overrides || {},
    });
  }

  private buildBackendUrl(config: INovuConfiguration) {
    const novuVersion = 'v1';

    if (!config?.backendUrl) {
      return `https://api.novu.co/${novuVersion}`;
    }

    return config?.backendUrl.includes('novu.co/v')
      ? config?.backendUrl
      : config?.backendUrl + `/${novuVersion}`;
  }
}
