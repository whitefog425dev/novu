import { Injectable } from '@nestjs/common';
import { ChangeEntity, ChangeRepository } from '@novu/dal';
import { ApplyChangeCommand } from '../apply-change/apply-change.command';
import { BulkApplyChangeCommand } from './bulk-apply-change.command';
import { ApplyChange } from '../apply-change/apply-change.usecase';

@Injectable()
export class BulkApplyChange {
  constructor(private changeRepository: ChangeRepository, private applyChange: ApplyChange) {}

  async execute(command: BulkApplyChangeCommand): Promise<ChangeEntity[]> {
    const changes = await this.changeRepository.find(
      {
        _id: {
          $in: command.changeIds,
        },
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
      },
      '',
      { sort: { createdAt: 1 } }
    );

    return changes.reduce(async (prev, change) => {
      const list = await prev;
      const item = await this.applyChange.execute(
        ApplyChangeCommand.create({
          changeId: change._id,
          environmentId: command.environmentId,
          organizationId: command.organizationId,
          userId: command.userId,
        })
      );
      list.push(item);

      return list;
    }, Promise.resolve([]));
  }
}
