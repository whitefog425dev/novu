---
sidebar_position: 4
---

# How to Create Provider?
All of our providers need to implement one or more of our provider interfaces, based on provider feature, from Email, and SMS through Direct, In-app, and push.

For a provider template you can copy one of our existing provider in the `providers` folder in the notifire project, make the relevant changes and create a PR against the monorepo.

## Description

Providers allow us to handle message delivery over multiple channels. We have multiple providers for each channel (SMS, Email, Push, Direct, and orthers). To get started with adding a new provider lets look at setting up our repository. 

## Initialization

To setup the repository, be sure to install the required packages. 

```zsh
yarn install
```

At the root of the project build the `core` package to get started.

```zsh
cd packages/core && yarn run build
```

## Snippets

After the project is initialized creating a new provider is achievable with the following.

```zsh
yarn run generate:provide
```

Choose the provider type.

```zsh
yarn run v1.22.17
$ npx hygen provider new
? What type of provider is this? … 
❯ EMAIL
  SMS
```

For this example we will be selecting `EMAIL` as our provider type. The name for our provider will be exampleProvider.

```zsh
? Write the provider name camelCased: › exampleProvider
```

Once our exampleProvider is generated we will need to begin working from within `/providers/exampleProvider` to begin adding our provider. Be sure to write test alongside your provider. See below for template instances for our `exampleProvider`.

```ts
import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  IEmailOptions,
  IEmailProvider,
} from '@notifire/core';

export class ExampleProviderEmailProvider implements IEmailProvider {
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;

  constructor(
    private config: {
      apiKey: string;
    }
  ) {
  }

  async sendMessage(
    options: IEmailOptions
  ): Promise<ISendMessageSuccessResponse> {


    return {
      id: 'PLACEHOLDER',
      date: 'PLACEHOLDER'
    };
  }
}
```

Template test case for `emailProvider`.

```ts
import { ExampleProviderEmailProvider } from './exampleProvider.provider';

test('should trigger exampleProvider library correctly', async () => {

});
```

## Email Provider

This is a code example of a basic email provider, with minimal fields required by our ``` IEmailProvider ``` interface.

 ```ts
import { ChannelTypeEnum, IEmailProvider, IEmailOptions } from "@notifire/core";

import sendgridMail from "@sendgrid/mail";

export class SendgridEmailProvider implements IEmailProvider {
  id = "sendgrid";
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;

  constructor(
    private config: {
      apiKey: string;
      from: string;
    }
  ) {
    sendgridMail.setApiKey(this.config.apiKey);
  }

  async sendMessage(options: IEmailOptions): Promise<any> {
    return await sendgridMail.send({
      from: options.from || this.config.from,
      to: options.to,
      html: options.html,
      subject: options.subject,
    });
  }
}
 ```

## SMS Provider

This is a code example of a basic email provider, with minimal fields required by our ``` ISmsProvider ``` interface.

```typescript
import { ChannelTypeEnum, ISmsOptions, ISmsProvider } from "@notifire/core";

import { Twilio } from "twilio";

export class TwilioSmsProvider implements ISmsProvider {
  id = "twilio";
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;

  private twilioClient = new Twilio(
    this.config.accountSid,
    this.config.authToken
  );
  constructor(
    private config: {
      accountSid: string;
      authToken: string;
      from: string;
    }
  ) {}

  async sendMessage(options: ISmsOptions): Promise<any> {
    return await this.twilioClient.messages.create({
      body: options.content,
      to: options.to,
      from: this.config.from,
    });
  }
}
```

[github-template]: https://github.com/notifirehq/provider-template
