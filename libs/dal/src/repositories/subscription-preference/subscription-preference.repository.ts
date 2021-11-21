import { BaseRepository } from '../base-repository';
import { SubscriptionPreferenceEntity } from './subscription-preference.entity';
import { SubscriptionPreference } from './subscription-preference.schema';

export class SubscriptionPreferenceRepository extends BaseRepository<SubscriptionPreferenceEntity> {
  constructor() {
    super(SubscriptionPreference, SubscriptionPreferenceEntity);
  }
}
