import { ChannelTypeEnum } from '@novu/shared';
import { FilterQuery, Types } from 'mongoose';
import { BaseRepository } from '../base-repository';
import { MessageEntity } from './message.entity';
import { Message } from './message.schema';
import { NotificationTemplateEntity } from '../notification-template';

export class MessageRepository extends BaseRepository<MessageEntity> {
  constructor() {
    super(Message, MessageEntity);
  }

  async findBySubscriberChannel(
    environmentId: string,
    subscriberId: string,
    channel: ChannelTypeEnum,
    feedId?: string[],
    options: { limit: number; skip?: number } = { limit: 10 }
  ) {
    const requestQuery: FilterQuery<MessageEntity> = {
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      channel,
    };

    if (feedId === null) {
      requestQuery._feedId = { $eq: null };
    }

    if (feedId) {
      requestQuery._feedId = {
        $in: feedId,
      };
    }

    return await this.find(requestQuery, '', {
      limit: options.limit,
      skip: options.skip,
      sort: '-createdAt',
    });
  }

  async getUnseenCount(
    environmentId: string,
    subscriberId: string,
    channel: ChannelTypeEnum
  ): Promise<{ count: number; feeds: { _id: string; count: number }[] }> {
    const result = await this.aggregate([
      {
        $match: {
          _environmentId: Types.ObjectId(environmentId),
          _subscriberId: Types.ObjectId(subscriberId),
          seen: false,
          channel,
        },
      },
      {
        $group: {
          _id: '$_feedId',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const count = await this.count({
      _environmentId: environmentId,
      _subscriberId: subscriberId,
      seen: false,
      channel,
    });

    return { count, feeds: result };
  }

  async changeSeenStatus(subscriberId: string, messageId: string, isSeen: boolean) {
    return this.update(
      {
        _subscriberId: subscriberId,
        _id: messageId,
      },
      {
        $set: {
          seen: isSeen,
          lastSeenDate: new Date(),
        },
      }
    );
  }

  async updateFeedByMessageTemplateId(messageId: string, feedId: string) {
    return this.update(
      {
        _messageTemplateId: messageId,
      },
      {
        $set: {
          _feedId: feedId,
        },
      }
    );
  }

  async getBulkMessagesByNotificationIds(environmentId: string, notificationIds: string[]) {
    return this.find({
      _environmentId: environmentId,
      _notificationId: {
        $in: notificationIds,
      },
    });
  }

  async updateMessageStatus(
    id: string,
    status: 'error' | 'sent' | 'warning',
    // eslint-disable-next-line
    providerPayload: any = {},
    errorId: string,
    errorText: string
  ) {
    return await this.update(
      {
        _id: id,
      },
      {
        $set: {
          status,
          errorId,
          errorText,
          providerPayload,
        },
      }
    );
  }
  async getActivityGraphStats(date: Date, environmentId: string) {
    return await this.aggregate([
      {
        $match: {
          createdAt: { $gte: date },
          _environmentId: Types.ObjectId(environmentId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);
  }

  async getFeed(
    environmentId: string,
    query: { channels?: ChannelTypeEnum[]; templates?: string[]; subscriberId?: string } = {},
    skip = 0,
    limit = 10
  ) {
    const requestQuery: FilterQuery<NotificationTemplateEntity> = {
      _environmentId: environmentId,
    };

    if (query?.channels) {
      requestQuery.channel = {
        $in: query.channels,
      };
    }

    if (query?.templates) {
      requestQuery._templateId = {
        $in: query.templates,
      };
    }

    if (query?.subscriberId) {
      requestQuery._subscriberId = query?.subscriberId;
    }

    const totalCount = await this.count(requestQuery);
    const response = await Message.find(requestQuery)
      .populate('subscriber', 'firstName _id lastName email')
      .populate('template', 'name _id')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    return {
      totalCount,
      data: this.mapEntities(response),
    };
  }
}
