# Firebase Cloud Messages

Firebase Cloud Messages is a free notification delivery service provided by Google Firebase.

To enable the FCM integration, you need to get your service account key from the Firebase dashboard. You can acquire the account key JSON by selecting your project, clicking the gear icon in top of the sidebar, going to service account tab and download the JSON.

After that, manually get the values from the JSON to the right fields. You can use a tool like [JSON Formatter](https://jsonformatter.curiousconcept.com/) to get the values more easily.

The overrides field supports all [NotificationMessagePayload](https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.notificationmessagepayload.md#notificationmessagepayload_interface) values, example below.

Device/notification identifiers can be set by using [Subscriber Credentials](/platform/subscribers#updating-subscriber-credentials) or by using the `deviceIdentifiers` field in overrides.

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
      abc: 'def',
    },
  })
  ```

  </TabItem>
</Tabs>
