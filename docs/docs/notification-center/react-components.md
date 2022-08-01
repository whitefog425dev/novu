# React Component

Novu provides the `@novu/notification-center` a react library that helps to add a fully functioning notification center  to your web application in minutes. Let's do a quick recap on how we can easily use it in your application:

```bash
npm install @novu/notification-center
```

```tsx
import { NovuProvider, PopoverNotificationCenter, NotificationBell, IMessage } from '@novu/notification-center';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
  function onNotificationClick(notification: IMessage) {
    navigate(notification.cta.data.url);
  }
  
  return (
    <NovuProvider subscriberId={'USER_ID'} applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}>
      <PopoverNotificationCenter onNotificationClick={onNotificationClick}>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
```

## Use your own backend and socket url

By default, Novu's hosted services of api and socket are used. Should you want, you could override them and configure your own.

```tsx
import { NovuProvider, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center';

function Header() {
  return (
    <NovuProvider
        backendUrl={'YOUR_BACKEND_URL'}
        socketUrl={'YOUR_SOCKET_URL'}
        subscriberId={'USER_ID'}
        applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}
      >
      <PopoverNotificationCenter>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
```

## Implementing custom bell icon

It is common that you might have a special set of icons you use within your application and you will want to replace the default: `NotificationBell` coming from our library.

For this you can easily switch the `NotificationBell` with your own bell. Just make sure you pass the `unseenCount` param inside and use it accordingly.

```tsx
  <PopoverNotificationCenter>
    {({ unseenCount }) => <CustomBell unseenCount={unseenCount} />}
  </PopoverNotificationCenter>
```

## Dark mode support

To support dark mode in your application the notification center component can receive a `colorScheme` prop that can receive either `dark` or `light` mode.

```tsx
  <PopoverNotificationCenter colorScheme={'dark' || 'light'}>
    {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
  </PopoverNotificationCenter>
```

## Custom UI

If you prefer to build a custom UI, it's possible to use the `useNotification` hook available in our react library.
Let's see an example on how you can do that:

```tsx
import { NovuProvider, useNotifications } from '@novu/notification-center';

function App() {
  return (
    <NovuProvider subscriberId={'USER_ID'} applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}>
      <CustomNotificationCenter />
    </NovuProvider>
  );
}

function CustomNotificationCenter() {
  const { 
    notifications,
    fetchNextPage,
    hasNextPage,
    fetching,
    markAsSeen,
    refetch
  } = useNotifications();
  
  return (
    <ul>
      {notifications.map((notification) => {
        return (
          <li>
            {notification.content}
          </li>
        )
      })}
    </ul>
  );
}
```

:::tip

If you only wish to modify some parts of the existing Novu component UI, you can easily override the: Header, Footer, and NotificationItem blocks including the notification actions block.

:::

## Customize the UI language

If you want to use a language other than english for the UI, the `NovuProvider` component can accept an optional `i18n` prop.

```tsx
import { NovuProvider, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center';

function Header() {
  return (
    <NovuProvider
        subscriberId={'USER_ID'}
        applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}
        i18n="en"
      >
      <PopoverNotificationCenter>
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
}
```

The `i18n` prop can accept 2 different types of values

- 2 letter language string

  ```tsx
  i18n="en" // We currently only support English
  ```

- Translation object

  ```tsx
  i18n={{
    // Make sure that the following is a proper 2 letter language code,
    // since this is used by moment.js in order to calculate the relative time for each notification
    lang: "de",
    
    translations: {
      poweredBy: "unterstützt von",
      markAllAsRead: "Alles als gelesen markieren",
      notifications: "Benachrichtigungen",
    },
  }}
  ```

## The notification `IMessage` model

When building your custom UI implementation it might be useful to know, how the notification feed model is structured so you can customize the notification items during rendering.

The notifications array returned by the `useNotifications` hook contains an array of `IMessage` objects with the following properties:

| Property                    | Type                       | Description                                                                                            |
|-----------------------------|----------------------------|--------------------------------------------------------------------------------------------------------|
| `_id`                       | `string`                   | A unique Novu message identifier                                                                       |
| `channel`                   | `ChannelTypeEnum`          | Use to specify the actual channel of this message (`in_app` will be used here)                         |
| `seen`                      | `boolean`                  | Whether the notification item was ready by the user, changed when the user clicks on the notification  |
| `lastSeenDate`              | `ISODate`                  | When the user has last seen the notification                                                           |
| `content`                   | `string`                   | An HTML string of the generated notification content with parsed and replaced variables                |
| `templateIdentifier`        | `string`                   | A unique Novu template identifier                                                                      |
| `payload`                   | `Record<string, unknown>`  | The `payload` object that was passed the notification template was triggered.                          |
| `createdAt`                 | `ISODate`                  | The creation date of the message                                                                       |
| `cta.type`                  | `ChannelCTATypeEnum`       | The type of the CTA specified in the admin panel                                                       |
| `cta.data.url`              | `string`                   | The redirect URL set in the admin panel, can be used to navigate on notification click                 |
| `cta.action.status`         | `boolean`                  | Indication whether the action occurred                                                                 |
| `cta.action.buttons`        | `IMessageButton[]`         | Array of action buttons                                                                                |
| `cta.action.result.payload` | `Record<string, unknown>`  | Payload object that send on updateAction method in useNotifications hook                               |
| `cta.action.result.type`    | `ButtonTypeEnum`           | Type of the button                                                                                     |

### IMessageButton

| Property   | Type             | Description        |
|------------|------------------|--------------------|
| `type`     | `ButtonTypeEnum` | Button type enum   |
| `content`  | `string`         | Button inner text  |

### ChannelCTATypeEnum

| Property     | Value    |
|--------------|----------|
| `REDIRECT`   | redirect |

### ButtonTypeEnum

| Property    | Value     |
|-------------|-----------|
| `PRIMARY`   | primary   |
| `SECONDARY` | secondary |

## Realtime sockets

Novu provides a real-time socket API for you to consume to get updates about new notifications added to the user's feed. To use the socket connection you can use the `useSocket` hook provided by the `@novu/notification-center` library. Let's see an example of that:

```tsx
import { NovuProvider, useSocket } from '@novu/notification-center';

function App() {
  return (
    <NovuProvider subscriberId={'USER_ID'} applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}>
      <CustomNotificationCenter />
    </NovuProvider>
  );
}

function CustomNotificationCenter() {
  const { socket } = useSocket();
  
  useEffect(() => {
    if (socket) {
      socket.on('unseen_count_changed', (data) => {
        console.log(data.unseenCount);
      });
    }

    return () => {
      if (socket) {
        socket.off('unseen_count_changed');
      }
    };
  }, [socket]);
  
  return <></>;
}
```

## Notification actions

By adding action buttons on the in-app template in the editor you will need to add a matching behaviour on what happens after the user clicks on the action.

Let's look at an example:

```tsx
import { NovuProvider, useSocket, useNotifications, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center';

export function App() {
  return (
    <>
      <NovuProvider
        subscriberId={'USER_ID'}
        applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}>
        <PopoverWrapper />
      </NovuProvider>
    </>
  );
}

function PopoverWrapper() {
  const { updateAction } = useNotifications();

  function handlerOnNotificationClick(message: IMessage) {
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  }

  async function handlerOnActionClick(templateIdentifier: string, type: ButtonTypeEnum, message: IMessage) {
    if (templateIdentifier === "friend-request") {
      if (type === 'primary') {
        /** Call your API to accept the friend request here **/

        /** And than update novu that this actions has been taken, so the user won't see the button again **/
        await updateAction(message._id, type, MessageActionStatusEnum.DONE);  
      }
      
    }
  }

  return (
    <PopoverNotificationCenter
      onNotificationClick={handlerOnNotificationClick}
      onActionClick={handlerOnActionClick}
    >
      {({ unseenCount }) => {
        return <NotificationBell unseenCount={unseenCount} />;
      }}
    </PopoverNotificationCenter>
  );
}

```

Novu manages the state of the actions, so you can actually specify if the user has already performed the actions so you can know when the actions should be hidden.

## HMAC Encryption

When Novu's user adds the notification center to their application they are required to pass a `subscriberId` which identifies the user's end-customer, and the application Identifier which is acted as a public key to communicate with the notification feed API.

A malicious actor can access the user feed by accessing the API and passing another `subscriberId` using the public application identifier.

HMAC encryption will make sure that a `subscriberId` is encrypted using the secret API key, and those will prevent malicious actors from impersonating users.

### Enabling HMAC Encryption

In order to enable Hash-Based Message Authentication Codes, you need to visit the admin panel in-app settings page and enable HMAC encryption for your environment.

Next step would be to generate an HMAC encrypted subscriberId on your backend:

```ts
import { createHmac } from 'crypto';

const hmacHash = createHmac('sha256', process.env.NOVU_API_KEY)
  .update(subscriberId)
  .digest('hex');
```

Then pass the created HMAC to your client side application forward it to the component:

```tsx
<NovuProvider subscriberId={'PLAIN_TEXT_ID'} subscriberHash={'HASHED_SUBSCRIBER_ID'} applicationIdentifier={'APP_ID'}>
</NovuProvider>
```

## Customizing the notification center theme

The notification center component can be customized by passing a `theme` prop to the `PopoverNotificationCenter` component.

```tsx
const theme: INovuTheme = {
   dark: {
      // Dark Theme Props
   },
   light: {
       // Light Theme Props
   },
   common: {
      // Common
   }
};

<PopoverNotificationCenter theme={theme}>
  {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
</PopoverNotificationCenter>

export interface INovuTheme {
  layout?: IThemeLayout;
  header?: IThemeHeader;
  popover?: IThemePopover;
  notificationItem?: IThemeNotificationListItem;
  footer?: IThemeFooter;
  loaderColor?: string;
}

```

A theme object can be used to customize the notification center's layout, header, popover, notification list item, footer, and unseen badge.
The object can be modified partially or completely, depending on the level of customization you want to achieve.

Here are the optional fields that can be used to customize the notification center:

A table of IThemeLayout properties:

### `IThemeLayout` customization properties

| Property                     | Default Value - Light Theme              | Default Value - Dark Theme        |
|------------------------------|------------------------------------------|-----------------------------------|
| `background`                 | `#FFFFFF`                                | `#1E1E26`                         |  
| `boxShadow`                  | `0px 5px 15px rgba(122, 133, 153, 0.25)` | `0px 5px 20px rgba(0, 0, 0, 0.2)` |
| `wrapper.secondaryFontColor` | `#BEBECC`                                | `#525266`                         |

### `IThemeHeader` customization properties

| Property         | Default Value - Light Theme                     | Default Value - Dark Theme                      |
|------------------|-------------------------------------------------|-------------------------------------------------|
| `badgeColor`     | `linear-gradient(0deg,#FF512F 0%,#DD2476 100%)` | `linear-gradient(0deg,#FF512F 0%,#DD2476 100%)` |  
| `badgeTextColor` | `#FFFFFF`                                       | `#FFFFFF`                                       |
| `fontColor`      | `#828299`                                       | `#FFFFFF`                                       |

### `IThemePopover` customization properties

| Property     | Default Value - Light Theme | Default Value - Dark Theme |
|--------------|-----------------------------|----------------------------|
| `arrowColor` | `#FFFFFF`                   | `#1E1E26`                  |  

### `IThemeNotificationListItem` customization properties

| Property                                  | Default Value - Light Theme                               | Default Value - Dark Theme                                |
|-------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------|
| `seen.fontColor`                          | `#828299`                                                 | `#FFFFFF`                                                 |  
| `seen.background`                         | `#F5F8FA`                                                 | `#23232B`                                                 |  
| `seen.timeMarkFontColor`                  | `#BEBECC`                                                 | `#525266`                                                 |
| `unseen.fontColor`                        | `#828299`                                                 | `#FFFFFF`                                                 |
| `unseen.background`                       | `#FFFFFF`                                                 | `#292933`                                                 |
| `unseen.boxShadow`                        | `0px 5px 15px rgba(122, 133, 153, 0.25)`                  | `0px 5px 20px rgba(0, 0, 0, 0.2)`                         |
| `unseen.notificationItemBeforeBrandColor` | `linear-gradient(0deg,#FF512F 0%,#DD2476 100%)`           | `linear-gradient(0deg,#FF512F 0%,#DD2476 100%)`           |
| `unseen.timeMarkFontColor`                | `#828299`                                                 | `#828299`                                                 |
| `buttons.primary.backGroundColor`         | `linear-gradient(99deg,#DD2476 0% 0%, #FF512F 100% 100%)` | `linear-gradient(99deg,#DD2476 0% 0%, #FF512F 100% 100%)` |
| `buttons.primary.fontColor`               | `#FFFFFF`                                                 | `#FFFFFF`                                                 |
| `buttons.primary.removeCircleColor`       | `white`                                                   | `white`                                                   |
| `buttons.primary.fontFamily`              | `Lato`                                                    | `Lato`                                                    |
| `buttons.secondary.backGroundColor`       | `#F5F8FA`                                                 | `#3D3D4D`                                                 |
| `buttons.secondary.fontColor`             | `#525266`                                                 | `#FFFFFF`                                                 |
| `buttons.secondary.removeCircleColor`     | `#525266`                                                 | `#525266`                                                 |
| `buttons.secondary.fontFamily`            | `Lato`                                                    | `Lato`                                                    |

### `IThemeFooter` customization properties

| Property              | Default Value - Light Theme | Default Value - Dark Theme |
|-----------------------|-----------------------------|----------------------------|
| `logoTextColor`       | `#000000`                   | `#FFFFFF`                  |  
| `logoPrefixFontColor` | `#A1A1B2`                   | `#525266`                  |  

### `NotificationBell` customization properties

| Property                     | Default Value - Light Theme                          | Default Value - Dark Theme                              |
|------------------------------|------------------------------------------------------|---------------------------------------------------------|
| `colorScheme`                | `light`                                              | `light`                                                 |  
| `unseenBadgeColor`           | `stopColor: '#FF512F', stopColorOffset: '#DD2476'`   | `{ stopColor: '#FF512F', stopColorOffset: '#DD2476' }`  |  
| `unseenBadgeBackgroundColor` | `#FFFFFF`                                            | `#1E1E26`                                               |  

Note: unseenBadgeColor is of a type : string | {stopColor : string, stopColorOffset : sting}, so if you would like one
color badge you can use a string of the color and not the object in order to create gradient.

## Multiple tab layout

Novu allows to create a multi-tab experience for a notification center, in a way you can fetch the notifications feed using a filtered query.

### Defining a stores

To create multiple stores you can use the prop `stores` on the `NovuProvider` component. Each store has `storeId` property that will be used to interact with information related to this store.

```tsx
<NovuProvider
    stores={[
      { storeId: 'invites', query: { feedIdentifier: 'invites' } },
      { storeId: 'activity', query: { feedIdentifier: 'activity' } },
    ]}
    backendUrl={API_ROOT}
    socketUrl={WS_URL}
    subscriberId={user?._id}
    applicationIdentifier={environment?.identifier}
  >
  <PopoverWrapper />
</NovuProvider>
```

Using the `query` object multiple fields can be passed for feed API:

- `feedIdentifier` - Can be configured and created on the WEB UI
- `seen` - Identifies if the notification has been seen or not

After specifying the `stores` prop, you can use the `storeId` property to interact with the store. 

:::tip

By specifying only a storeId, without a query, you could get all notifications.

:::

#### Using the `useNotifications` hook

```tsx
  import { useNotifications } from '@novu/core';
  
  const { notifications } = useNotifications({ storeId });
```

#### Using `tabs` prop on the notification center

```tsx
<PopoverNotificationCenter
      tabs={[
        { name: 'Invites', storeId: 'invites' },
        { name: 'Activity', storeId: 'activity' },
      ]}
      colorScheme={colorScheme}
      onNotificationClick={handlerOnNotificationClick}
      onActionClick={handlerOnActionClick}
    >
    {({ unseenCount }) => {
      return <NotificationBell colorScheme={colorScheme} unseenCount={unseenCount} />;
    }}
</PopoverNotificationCenter>
```

#### Custom Notification Item component

```tsx
<PopoverNotificationCenter
      
      colorScheme={colorScheme}
      onNotificationClick={handlerOnNotificationClick}
      onActionClick={handlerOnActionClick}
      listItem={(notification, handleActionButtonClick, handleNotificationClick) => {
        return (
          <a href='/' onClick={(e) => {
            e.preventDefault();
            handleNotificationClick();
          }}>
            {notification.content}
          </a>
        );
      }}
    >
    {({ unseenCount }) => {
      return <NotificationBell colorScheme={colorScheme} unseenCount={unseenCount} />;
    }}
</PopoverNotificationCenter>
```
