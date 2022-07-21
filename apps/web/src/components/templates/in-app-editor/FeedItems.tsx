import React, { useState } from 'react';
import { Popover, useMantineTheme, Grid, ColorScheme } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/react';
import { IFeedEntity } from '@novu/shared';
import { showNotification } from '@mantine/notifications';
import { FeedChip } from './FeedChip';
import { colors, shadows, Text, Tooltip, Button } from '../../../design-system';
import { Copy, Trash } from '../../../design-system/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteFeed, getFeeds } from '../../../api/feeds';
import { QueryKeys } from '../../../api/query.keys';

interface IFeedItemPopoverProps {
  showFeed: boolean;
  index: number;
  setValue: (key: string, value: string, options: { shouldDirty: boolean }) => void;
  field: any;
}

export function FeedItems(props: IFeedItemPopoverProps) {
  const { data: feeds } = useQuery<IFeedEntity[]>(QueryKeys.getFeeds, getFeeds);

  return (
    <FeedsBlock>
      <Grid gutter={10}>
        {(feeds || []).map((item, feedIndex) => {
          return (
            <Grid.Col span={4}>
              <FeedPopover
                field={props.field}
                item={item}
                feedIndex={feedIndex}
                showFeed={props.showFeed}
                index={props.index}
                setValue={props.setValue}
              />
            </Grid.Col>
          );
        })}
      </Grid>
    </FeedsBlock>
  );
}

function FeedPopover(props: IFeedPopoverProps) {
  const [opened, setOpened] = useState(false);
  const { colorScheme } = useMantineTheme();

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <FeedChip
          item={props.item}
          feedIndex={props.feedIndex}
          setOpened={setOpened}
          index={props.index}
          showFeed={props.showFeed}
          field={props.field}
          setValue={props.setValue}
          onEditClick={() => {
            setOpened((prevCheck) => !prevCheck);
          }}
        />
      }
      width={260}
      position={'bottom'}
      placement={'center'}
      withArrow
      styles={{
        root: {
          width: '100%',
          height: '1px',
        },
        inner: { margin: 0, padding: 0, height: '95px' },
        arrow: {
          backgroundColor: colorScheme === 'dark' ? colors.B20 : colors.white,
          height: '-22px',
          border: 'none',
          margin: '0px',
          top: '-3px',
        },
        body: {
          backgroundColor: colorScheme === 'dark' ? colors.B20 : colors.white,
          color: colorScheme === 'dark' ? colors.white : colors.B40,
          border: 'none',
          marginTop: '1px',
          width: '100%',
        },
        popover: { width: '170px', height: '95px' },
      }}
    >
      <PopoverActionBlock setOpened={setOpened} showFeed={props.showFeed} feedItem={props.item} />
    </Popover>
  );
}

function PopoverActionBlock({
  setOpened,
  showFeed,
  feedItem,
}: {
  setOpened: (boolean) => void;
  showFeed: boolean;
  feedItem?: IFeedEntity;
}) {
  const { colorScheme } = useMantineTheme();

  return (
    <ActionBlockWrapper colorScheme={colorScheme} onMouseLeave={() => setOpened(false)}>
      <CopyBlock showFeed={showFeed} feedItem={feedItem} />
      <DeleteBlock setOpened={setOpened} showFeed={showFeed} feedItem={feedItem} />
    </ActionBlockWrapper>
  );
}

function CopyBlock({ showFeed, feedItem }: { showFeed: boolean; feedItem?: IFeedEntity }) {
  const [opened, setOpened] = useState(false);

  const { colorScheme } = useMantineTheme();
  const clipboardIdentifier = useClipboard({ timeout: 1000 });

  function handleOnclick() {
    clipboardIdentifier.copy(feedItem?.identifier);
    setOpened(true);
    setTimeout(() => {
      setOpened(false);
    }, 1000);
  }

  return (
    <Row disabled={!showFeed} onClick={handleOnclick}>
      <Tooltip label={'Copied!'} opened={opened}>
        <Copy
          style={{
            color: colorScheme === 'dark' ? colors.white : colors.B80,
          }}
        />
      </Tooltip>
      <Text>Copy ID</Text>
    </Row>
  );
}

function DeleteBlock({
  setOpened,
  showFeed,
  feedItem,
}: {
  setOpened: (boolean) => void;
  showFeed: boolean;
  feedItem?: IFeedEntity;
}) {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteFeedById } = useMutation<
    IFeedEntity[],
    { error: string; message: string; statusCode: number },
    string
  >((feedId) => deleteFeed(feedId), {
    onSuccess: (data) => {
      queryClient.refetchQueries([QueryKeys.getFeeds]);
    },
  });

  async function deleteFeedHandler(feedId: string) {
    try {
      await deleteFeedById(feedId);
      setOpened(false);
      showNotification({
        message: 'Feed deleted successfully',
        color: 'green',
      });
    } catch (e: any) {
      Sentry.captureException(e);

      showNotification({
        message: e.message || 'Un-expected error occurred',
        color: 'red',
      });
    }
  }

  return (
    <Row disabled={!showFeed} onClick={() => deleteFeedHandler(feedItem?._id || '')}>
      <Trash
        style={{
          color: theme.colorScheme === 'dark' ? colors.white : colors.B80,
        }}
      />
      <Text>Delete Feed</Text>
    </Row>
  );
}

const ActionBlockWrapper = styled.div<{ colorScheme: ColorScheme }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  border-radius: 7px;
  box-shadow: ${({ colorScheme }) => (colorScheme === 'dark' ? shadows.dark : shadows.medium)};
`;

const Row = styled(Button)`
  display: flex;
  justify-content: start;
  align-items: center;
  z-index: 2;
  margin-right: 5px;
  margin-left: 5px;

  background: ${colors.B20};
  box-shadow: none;
  :hover {
    background: ${colors.B40};
  }
`;

const FeedsBlock = styled.div`
  margin-bottom: 20px;
`;

interface IFeedPopoverProps {
  setValue: (key: string, value: string, options: { shouldDirty: boolean }) => void;
  showFeed: boolean;
  feedIndex: number;
  index: number;
  item: IFeedEntity;
  field: any;
}
