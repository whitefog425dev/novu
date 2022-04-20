import { Injectable, NotFoundException } from '@nestjs/common';
import { ChangeEntity, ChangeRepository } from '@novu/dal';
import { PromoteChangeToEnvironmentCommand } from '../promote-change-to-environment/promote-change-to-environment.command';
import { PromoteChangeToEnvironment } from '../promote-change-to-environment/promote-change-to-environment.usecase';
import { ApplyChangeCommand } from './apply-change.command';

@Injectable()
export class ApplyChange {
  constructor(
    private changeRepository: ChangeRepository,
    private promoteChangeToEnvironment: PromoteChangeToEnvironment
  ) {}

  async execute(command: ApplyChangeCommand): Promise<ChangeEntity> {
    const change = await this.changeRepository.findOne({
      _id: command.changeId,
      _environmentId: command.environmentId,
      _organizationId: command.organizationId,
    });

    if (!change) {
      throw new NotFoundException();
    }

    await this.changeRepository.update(
      {
        _id: command.changeId,
        _environmentId: command.environmentId,
        _organizationId: command.organizationId,
      },
      {
        enabled: true,
      }
    );

    await this.promoteChangeToEnvironment.execute(
      PromoteChangeToEnvironmentCommand.create({
        itemId: change._entityId,
        type: change.type,
        environmentId: change._environmentId,
        organizationId: change._organizationId,
        userId: command.userId,
      })
    );

    return change;
  }
}
