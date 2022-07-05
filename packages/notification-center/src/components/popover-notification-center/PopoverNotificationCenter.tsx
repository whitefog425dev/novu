import React, { useContext } from 'react';
import { IMessage } from '@novu/shared';
import { NotificationCenter } from '../notification-center';
import { INotificationBellProps } from '../notification-bell';
import { Popover } from './components/Popover';
import { UnseenCountContext } from '../../store/unseen-count.context';
import { INovuThemePopoverProvider } from '../../store/novu-theme-provider.context';
import { useDefaultTheme } from '../../hooks';
import { ColorScheme } from '../../index';

interface IPopoverNotificationCenterProps {
  onUrlChange?: (url: string) => void;
  onNotificationClick: (notification: IMessage) => void;
  onUnseenCountChanged?: (unseenCount: number) => void;
  children: (props: INotificationBellProps) => JSX.Element;
  header?: () => JSX.Element;
  footer?: () => JSX.Element;
  colorScheme: ColorScheme;
  theme?: INovuThemePopoverProvider;
}

export function PopoverNotificationCenter({ children, ...props }: IPopoverNotificationCenterProps) {
  const { theme } = useDefaultTheme({ colorScheme: props.colorScheme, theme: props.theme });
  const { setUnseenCount, unseenCount } = useContext(UnseenCountContext);

  function handlerOnUnseenCount(count: number) {
    if (isNaN(count)) return;
    setUnseenCount(count);

    if (props.onUnseenCountChanged) {
      props.onUnseenCountChanged(count);
    }
  }

  return (
    <Popover theme={theme} bell={(bellProps) => children({ ...bellProps, unseenCount, theme })}>
      <NotificationCenter
        onNotificationClick={props.onNotificationClick}
        onUnseenCountChanged={handlerOnUnseenCount}
        onUrlChange={props.onUrlChange}
        header={props.header}
        footer={props.footer}
        colorScheme={props.colorScheme}
        theme={props.theme}
      />
    </Popover>
  );
}
