import { BaseRepository } from '../base-repository';
import { SubscriberEntity } from './subscriber.entity';
import { Subscriber } from './subscriber.schema';

export class SubscriberRepository extends BaseRepository<SubscriberEntity> {
  constructor() {
    super(Subscriber, SubscriberEntity);
  }

  async findBySubscriberId(environmentId: string, subscriberId: string) {
    return await this.findOne({
      _environmentId: environmentId,
      subscriberId,
    });
  }

  async searchSubscriber(environmentId: string, search: string) {
    return await this.findOne({
      _environmentId: environmentId,
      $or: [
        {
          email: {
            $regex: regExpEscape(search),
            $options: 'i',
          },
        },
        {
          subscriberId: search,
        },
      ],
    });
  }
}

function regExpEscape(literalString: string): string {
  return literalString.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
}
