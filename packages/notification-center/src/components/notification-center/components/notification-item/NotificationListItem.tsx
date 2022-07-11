import styled, { css } from 'styled-components';
import { IMessage, ButtonTypeEnum, IMessageAction, MessageActionStatusEnum } from '@novu/shared';
import moment from 'moment';
import { DotsHorizontal } from '../../../../shared/icons';
import React, { useContext } from 'react';
import { INovuTheme } from '../../../../store/novu-theme.context';
import { useNovuThemeProvider } from '../../../../hooks/use-novu-theme-provider.hook';
import { ActionContainer } from './ActionContainer';
import { useNotifications } from '../../../../hooks';
import { NotificationCenterContext } from '../../../../store/notification-center.context';

export function NotificationListItem({
  notification,
  onClick,
  onActionButtonClick,
}: {
  notification: IMessage;
  onClick: (notification: IMessage, actionButtonType?: ButtonTypeEnum) => void;
  onActionButtonClick: (message: IMessage) => void;
}) {
  const { theme: novuTheme } = useNovuThemeProvider();
  const { markActionAsDone, markAsSeen: markNotificationAsSeen } = useNotifications();
  const { notificationItemActionBlock } = useContext(NotificationCenterContext);

  function handleNotificationClick() {
    onClick(notification);
  }

  async function handleActionButtonClick(actionButtonType?: ButtonTypeEnum) {
    await markNotificationAsSeen(notification._id);
    const message = await markActionAsDone(notification._id, actionButtonType);

    if (onActionButtonClick) {
      onActionButtonClick(message);
    }
  }

  return (
    <ItemWrapper
      novuTheme={novuTheme}
      data-test-id="notification-list-item"
      unseen={!notification.seen}
      onClick={() => handleNotificationClick()}
    >
      <NotificationItemContainer>
        <TextContent
          data-test-id="notification-content"
          dangerouslySetInnerHTML={{
            __html: notification.content as string,
          }}
        />
        <TimeMark novuTheme={novuTheme} unseen={!notification.seen}>
          {moment(notification.createdAt).fromNow()}
        </TimeMark>
        {notificationItemActionBlock && notification?.cta?.action?.status === MessageActionStatusEnum.DONE ? (
          notificationItemActionBlock(notification?.cta?.action)
        ) : (
          <ActionContainerOrNone handleActionButtonClick={handleActionButtonClick} action={notification?.cta?.action} />
        )}
      </NotificationItemContainer>
      <SettingsActionWrapper style={{ display: 'none' }}>
        <DotsHorizontal />
      </SettingsActionWrapper>
    </ItemWrapper>
  );
}

function ActionContainerOrNone({
  action,
  handleActionButtonClick,
}: {
  action: IMessageAction;
  handleActionButtonClick: () => void;
}) {
  return <>{action ? <ActionContainer onActionButtonClick={handleActionButtonClick} action={action} /> : null}</>;
}

const NotificationItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: normal;
  width: 100%;
`;

const TextContent = styled.div`
  line-height: 16px;
`;

const SettingsActionWrapper = styled.div`
  color: ${({ theme }) => theme.colors.secondaryFontColor};
`;

const unseenNotificationStyles = css<{ novuTheme: INovuTheme }>`
  background: ${({ novuTheme }) => novuTheme?.notificationItem?.unseen?.background};
  box-shadow: ${({ novuTheme }) => novuTheme?.notificationItem?.unseen?.boxShadow};
  color: ${({ novuTheme }) => novuTheme?.notificationItem?.unseen?.fontColor};
  font-weight: 700;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 5px;
    border-radius: 7px 0 0 7px;
    background: ${({ novuTheme }) => novuTheme?.notificationItem?.unseen?.notificationItemBeforeBrandColor};
  }
`;
const seenNotificationStyles = css<{ novuTheme: INovuTheme }>`
  color: ${({ novuTheme }) => novuTheme?.notificationItem?.seen?.fontColor};
  background: ${({ novuTheme }) => novuTheme?.notificationItem?.seen?.background};
  font-weight: 400;
  font-size: 14px;
`;

const ItemWrapper = styled.div<{ unseen?: boolean; novuTheme: INovuTheme }>`
  padding: 15px;
  position: relative;
  display: flex;
  line-height: 20px;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
  margin: 10px 15px;

  &:hover {
    cursor: pointer;
  }

  ${({ unseen }) => {
    return unseen ? unseenNotificationStyles : seenNotificationStyles;
  }}
`;

const TimeMark = styled.div<{ novuTheme: INovuTheme; unseen?: boolean }>`
  min-width: 55px;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.5;
  line-height: 14.4px;
  color: ${({ unseen, novuTheme }) =>
    unseen
      ? novuTheme?.notificationItem?.unseen?.timeMarkFontColor
      : novuTheme?.notificationItem?.seen?.timeMarkFontColor};
`;
