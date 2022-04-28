import { ChangeEntityTypeEnum } from '@novu/shared';
import { BaseRepository } from '../base-repository';
import { ChangeEntity } from './change.entity';
import { Change } from './change.schema';

export class ChangeRepository extends BaseRepository<ChangeEntity> {
  constructor() {
    super(Change, ChangeEntity);
  }

  public async getEntityChanges(entityType: ChangeEntityTypeEnum, entityId: string): Promise<ChangeEntity[]> {
    return await this.find(
      {
        _entityId: entityId,
        type: entityType,
      },
      '',
      {
        sort: { createdAt: 1 },
      }
    );
  }

  public async getChangeId(entityType: ChangeEntityTypeEnum, entityId: string): Promise<string> {
    const change = await this.findOne({
      _entityId: entityId,
      type: entityType,
      enabled: false,
    });

    if (change) {
      return change._id;
    }

    return BaseRepository.createObjectId();
  }

  public async getList(organizationId: string, environmentId: string, enabled: boolean) {
    const items = await Change.find({
      _environmentId: environmentId,
      _organizationId: organizationId,
      enabled,
      _parentId: { $exists: false, $eq: null },
    }).populate('user');

    return this.mapEntities(items);
  }
}
