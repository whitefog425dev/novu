import { Injectable, Logger } from '@nestjs/common';
import { ChangeEntityTypeEnum, ChangeRepository, EnvironmentRepository } from '@novu/dal';
import { diffApply } from '../../utils';
import { PromoteChangeToEnvironmentCommand } from './promote-change-to-environment.command';
import { PromoteTypeChangeCommand } from '../promote-type-change.command';
import { PromoteNotificationTemplateChange } from '../promote-notification-template-change/promote-notification-template-change';
import { PromoteMessageTemplateChange } from '../promote-message-template-change/promote-message-template-change';

@Injectable()
export class PromoteChangeToEnvironment {
  constructor(
    private changeRepository: ChangeRepository,
    private environmentRepository: EnvironmentRepository,
    private changeEnabledNotificationTemplate: PromoteNotificationTemplateChange,
    private changeEnabledMessageTemplate: PromoteMessageTemplateChange
  ) {}

  async execute(command: PromoteChangeToEnvironmentCommand) {
    const changes = await this.changeRepository.getEntityChanges(command.type, command.itemId);
    const aggregatedItem = changes
      .filter((change) => change.enabled)
      .reduce((prev, change) => {
        diffApply(prev, change.change);

        return prev;
      }, {});

    const environment = await this.environmentRepository.findOne({
      _parentId: command.environmentId,
    });

    const typeCommand = PromoteTypeChangeCommand.create({
      organizationId: command.organizationId,
      environmentId: environment._id,
      item: aggregatedItem,
      userId: command.userId,
    });

    switch (command.type) {
      case ChangeEntityTypeEnum.NOTIFICATION_TEMPLATE:
        await this.changeEnabledNotificationTemplate.execute(typeCommand);
        break;
      case ChangeEntityTypeEnum.MESSAGE_TEMPLATE:
        await this.changeEnabledMessageTemplate.execute(typeCommand);
        break;
      default:
        Logger.error(`Change with type ${command.type} could not be enabled from environment ${command.environmentId}`);
    }
  }
}
