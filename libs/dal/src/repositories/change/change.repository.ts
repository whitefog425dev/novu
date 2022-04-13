import { BaseRepository } from '../base-repository';
import { ChangeEntity, ChangeEntityTypeEnum } from './change.entity';
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
        enabled: true,
      },
      '',
      {
        sort: { createdAt: 1 },
      }
    );
  }
}
