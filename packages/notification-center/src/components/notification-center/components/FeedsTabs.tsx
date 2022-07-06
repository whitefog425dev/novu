import React, { useContext } from 'react';
import { Center, Tab } from '@mantine/core';
import { NotificationsListTab } from './NotificationsListTab';
import { IFeedsContext } from '../../../index';
import { FeedsContext } from '../../../store/feeds.context';
import { UnseenBadge } from './UnseenBadge';
import { UnseenCountContext } from '../../../store/unseen-count.context';
import { Tabs } from './layout/tabs/Tabs';

export function FeedsTabs() {
  const { feeds } = useContext<IFeedsContext>(FeedsContext);
  const { unseenCount } = useContext(UnseenCountContext);

  return (
    <>
      {feeds ? (
        <Tabs>
          {feeds.map((feed) => (
            <Tab
              key={feed._id}
              label={
                <Center inline>
                  {feed.name} <UnseenBadge unseenCount={unseenCount} />
                </Center>
              }
            >
              <NotificationsListTab feedId={feed._id} />
            </Tab>
          ))}
        </Tabs>
      ) : (
        <NotificationsListTab />
      )}
    </>
  );
}
