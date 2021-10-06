---
sidebar_position: 4
---

# Password Reset

Password reset is one of the things you encounter with when building authentication if not using Auth0 or Cognito services.

```typescript
import { Notifire, ChannelTypeEnum } from "@notifire/core";
import { SendgridEmailProvider } from "@notifire/sendgrid";
import { TwilioSmsProvider } from "@notifire/twilio";

const notifire = new Notifire();

await notifire.registerProvider(
  new TwilioSmsProvider({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_FROM_NUMBER,
  })
);

await notifire.registerProvider(
  new SendgridEmailProvider({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

// Defined in a file or folder responsible for managing templates
const passwordResetTemplate = await notifire.registerTemplate({
  id: "password-reset-request",
  messages: [
    {
      subject: "Your password reset request for {{appName}}",
      channel: ChannelTypeEnum.EMAIL,
      template: `
          Hi {{firstName}}!

          To reset your password click <a href="{{resetLink}}">here.</a>
      `,
    },
    {
      channel: ChannelTypeEnum.SMS,
      template: `Your password reset request for {{appName}}. To reset your password click {{resetLink}}`,
      active: (data) => !data.$email,
    },
  ],
});

// Triggered in the relevant part of the business logic of your code
await notifire.trigger("password-reset-request", {
  $user_id: "<USER IDENTIFIER>",
  $email: "<USER EMAIL>",
  firstName: "John",
  lastName: "Doe",
  resetLink: "https://example.com/reset-password?token=123",
  appName: "My App",
});
```
