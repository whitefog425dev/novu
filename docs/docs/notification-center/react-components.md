# React Component

Novu provides the `@novu/notification-center` a react library that helps to add a fully functioning notification center  to your web application in minutes. Let's do a quick recap on how we can easily use it in your application:

```
npm install @novu/notification-center
```

```tsx
import { NovuProvider, PopoverNotificationCenter, NotificationBell } from '@novu/notification-center';

function Header() {
  return (
    <NovuProvider subscriberId={'USER_ID'} applicationIdentifier={'APP_ID_FROM_ADMIN_PANEL'}>
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
<NovuProvider subscriberId={'USER_ID'} colorScheme={'dark' || 'light'}>
  <PopoverNotificationCenter>
    {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
  </PopoverNotificationCenter>
</NovuProvider>
```

## Custom UI

If you prefer to build a custom UI, it's possible to use the `useNotification` hook available in our react library.
Let's see and example on how you can do that:

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

## Realtime sockets

Novu provides a real-time socket API for you to consume to get updates about new notifications added to the user's feed. To use the socket connection you can use the `useSocket` hook provided by the `@novu/notification-center` library. Let's see and example of that:

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
