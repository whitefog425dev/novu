# Novu Mailjet Provider

A Mailjet email provider library for [@novu/node](https://github.com/novu-co/novu)

## Usage

```javascript
    import { MailjetEmailProvider } from "@novu/mailjet";
    const provider = new MailjetEmailProvider({
      apiKey: process.env.MAILJET_APIKEY,
      apiSecret: process.env.MAILJET_API_SECRET,
      from: process.env.MAILJET_FROM_EMAIL,
    });
```
