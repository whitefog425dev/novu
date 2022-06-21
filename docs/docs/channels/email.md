import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Email

Novu can be used to deliver email message to your customers using a unified delivery API. You can easily integrate your favorite delivery provider using the built-in integration store.

## Configuring email providers
When creating an email provider integration you will be asked to provide additional fields alongside the provider-specific credentials:
- **Sender name** - Will be displayed as the sender of the message
- **From email address** - Emails sent using Novu will be sent using this address

For some email providers including SendGrid you will have to authenticate the **From email address** to make sure you will send email messages using an authorized address.

## Sending Email attachments
You can easily send attachments with the Novu API by passing the attachments array when triggering an Email based notification template.

this article, we’ll go over the benefits of planning for your webinar and top actionable tips to get you moving forward with your webinar marketing strategy.

<Tabs>
  <TabItem value="nodejs" label="Node.js" default>

  ```ts
  import { Novu } from '@novu/node';
  
  const novu = new Novu(process.env.NOVU_API_KEY);
  
  novu.trigger('event-name', {
    to: {
      subscriberId: '...'
    },
    payload: {
      attachments: [{
        file: fs.readFileSync(__dirname + '/data/test.jpeg'),
        name: 'test.jpeg',
        mime: 'image/jpg'
      }]
    }
  })
  ```

  </TabItem>
</Tabs>
