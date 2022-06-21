---
sidebar_position: 4
---

# How to add a Provider?

## Creating a Novu provider package

All of our providers need to implement one or more of our provider interfaces, based on provider feature, from Email, and SMS through Direct, In-app, and push.

For a provider template you can copy one of our existing provider in the `providers` folder in the novu project, make the relevant changes and create a PR against the monorepo.

### Description

Providers allow us to handle message delivery over multiple channels. We have multiple providers for each channel (SMS, Email, Push, Direct, and others). To get started with adding a new provider let's look at setting up our repository.

### Initialization

To setup the repository, run the initial setup command:

```zsh
npm run setup:project
```

At the root of the project build the `node` package to get started.

```zsh
cd packages/node && yarn run build
```

### Snippets

After the project is initialized creating a new provider is achievable with the following.

```zsh
yarn run generate:provider
```

Choose the provider type.

```zsh
yarn run v1.22.17
$ npx hygen provider new
? What type of provider is this? … 
❯ EMAIL
  SMS
```

For this example, we will be selecting `EMAIL` as our provider type. The name for our provider will be exampleProvider.

```zsh
? Write the provider name camelCased: › exampleProvider
```

Once our exampleProvider is generated we will need to begin working from within `/providers/exampleProvider` to begin adding our provider. Be sure to write the test alongside your provider. See below for template examples for our `exampleProvider`.

```ts
import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  IEmailOptions,
  IEmailProvider,
} from '@novu/stateless';

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

### Email Provider

This is a code example of a basic email provider, with minimal fields required by our ``` IEmailProvider ``` interface.

 ```ts
import { ChannelTypeEnum, IEmailProvider, IEmailOptions } from "@novu/stateless";

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

### SMS Provider

This is a code example of a basic email provider, with minimal fields required by our ``` ISmsProvider ``` interface.

```typescript
import { ChannelTypeEnum, ISmsOptions, ISmsProvider } from "@novu/stateless";

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

[GitHub Template](https://github.com/novuhq/provider-template)

## Add provider logos
In order to present the provider in the Integration store we need logos in dark and light mode, 
this step is desirable but not necessary you can add and we will check and update if necessary. 
If you locate the logos you can add them to `apps/web/public/static/images/providers` while the name of the file
is the name of the provider.
The possible formats are svg and png.


## Add config item with in the list
In order to build the UI integration store we need to provide it with list of provider integration.
This part is made up of two parts and the first is to create credentials config and the second one is to add
provider configuration to providers list.

### Create credentials config
We need to add the credentials that are needed in order to create integration with the provider. For example if you 
added email provider like SendGrid and the credentials are 'From', 'SenderName' and 'ApiKey' you will need to add 
a config object in `libs/shared/src/consts/providers/provider-credentials.ts` like below.

```typescript
export const sendgridConfig: IConfigCredentials[] = [
  {
    key: CredentialsKeyEnum.ApiKey,
    displayName: 'API Key',
    type: 'string',
  },
  ...mailConfigBase,
];
```


### Add provider to providers list
Now we need to add the provider data into the list that located in `libs/shared/src/consts/providers/channels/email.ts`.
Note that the id is the providers name, displayName is providers name in pascal case, credentials are the one 
you created on the previous step, logoFileName should be as it was on the adding logo step 
(with the format type included).

```typescript
 {
    id: 'sendgrid',
    displayName: 'SendGrid',
    channel: ChannelTypeEnum.EMAIL,
    credentials: sendgridConfig,
    docReference: 'https://docs.sendgrid.com/',
    logoFileName: { light: 'sendgrid.png', dark: 'sendgrid.png' }
}
```


## Add provider handler in the API

### Create provider handler
In order to map internally the different providers credentials, we need to add a provider handler that located in 
`apps/api/src/app/events/services/mail-service/handlers`. 

#### Newly create dependency that needed to be added.
In the previous step you create standalone provider package that will be published to NPM, however currently in 
your development it is yet published. In order to use it locally please go to the package.json 
located in `apps/api/package.json` and add it manually to the dependencies: 
`"@novu/<NEW_PROVIDER_NAME>": "^<VERSION>"`

Please note thea the provider name and version are located in provider package.json you created earlier.  

Example of SendGrid handler

```typescript
import { ChannelTypeEnum } from '@novu/shared';
import { SendgridEmailProvider } from '@novu/sendgrid';
import { BaseHandler } from './base.handler';

export class SendgridHandler extends BaseHandler {
  constructor() {
    super('sendgrid', ChannelTypeEnum.EMAIL);
  }

  buildProvider(credentials, from: string) {
    const config: { apiKey: string; from: string } = { apiKey: credentials.apiKey, from };

    this.provider = new SendgridEmailProvider(config);
  }
}
```

### Add handler to factory
The last step is to initialize the handler in the factory that located in 
`apps/api/src/app/events/services/mail-service/mail.factory.ts`

