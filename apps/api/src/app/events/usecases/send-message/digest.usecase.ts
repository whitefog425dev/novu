import { Injectable } from '@nestjs/common';
import { MessageRepository, JobRepository, NotificationRepository } from '@novu/dal';
import { CreateLog } from '../../../logs/usecases/create-log/create-log.usecase';
import { SendMessageCommand } from './send-message.command';
import { SendMessageType } from './send-message-type.usecase';
import * as moment from 'moment';

@Injectable()
export class Digest extends SendMessageType {
  constructor(
    protected messageRepository: MessageRepository,
    protected createLogUsecase: CreateLog,
    protected jobRepository: JobRepository,
    protected notificationRepository: NotificationRepository
  ) {
    super(messageRepository, createLogUsecase);
  }

  public async execute(command: SendMessageCommand) {
    const currentJob = await this.jobRepository.findOne({
      _id: command.jobId,
    });
    const notification = await this.notificationRepository.findById(command.notificationId);
    const amount =
      typeof currentJob?.digest.amount === 'number'
        ? currentJob?.digest.amount
        : parseInt(currentJob.digest.amount, 10);
    const earliest = moment(currentJob.createdAt)
      .subtract(amount, currentJob.digest.unit as moment.unitOfTime.DurationConstructor)
      .toDate();
    const jobs = await this.jobRepository.findJobsToDigest(
      earliest,
      notification._templateId,
      command.environmentId,
      command.subscriberId
    );

    const nextJob = await this.jobRepository.findOne({
      _parentId: command.jobId,
    });

    const events = [nextJob.payload, ...jobs.map((job) => job.payload)];
    await this.jobRepository.update(
      {
        _id: nextJob._id,
      },
      {
        $set: {
          digest: {
            events,
          },
        },
      }
    );
  }
}
