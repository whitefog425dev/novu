import { Injectable } from '@nestjs/common';
import { JobEntity, JobStatusEnum, JobRepository, NotificationStepEntity } from '@novu/dal';
import { ChannelTypeEnum, StepTypeEnum } from '@novu/shared';
import { DigestFilterStepsCommand } from './digest-filter-steps.command';
import { DigestFilterSteps } from './digest-filter-steps.usecase';

@Injectable()
export class DigestFilterStepsRegular {
  constructor(private jobRepository: JobRepository) {}

  public async execute(command: DigestFilterStepsCommand): Promise<NotificationStepEntity[]> {
    const steps = [DigestFilterSteps.createTriggerStep(command)];
    let delayedDigests: JobEntity = null;
    for (const step of command.steps) {
      if (step.template.type === StepTypeEnum.DIGEST) {
        delayedDigests = await this.getDigest(command, step);
      }

      if (this.shouldContinue(delayedDigests)) {
        continue;
      }

      steps.push(step);
    }

    return steps;
  }

  private async getDigest(command: DigestFilterStepsCommand, step: NotificationStepEntity) {
    const where: any = {
      status: JobStatusEnum.DELAYED,
      _subscriberId: command.subscriberId,
      _templateId: command.templateId,
      _environmentId: command.environmentId,
    };

    if (step.metadata.digestKey) {
      where['payload.' + step.metadata.digestKey] = command.payload[step.metadata.digestKey];
    }

    return await this.jobRepository.findOne(where);
  }

  private shouldContinue(delayedDigests): boolean {
    if (!delayedDigests) {
      return false;
    }
    if (!delayedDigests.digest.updateMode) {
      return true;
    }
    if (delayedDigests.type !== ChannelTypeEnum.IN_APP) {
      return true;
    }

    return false;
  }
}
