import { Inject, Injectable } from '@nestjs/common';
import { Queue, Worker, QueueBaseOptions } from 'bullmq';
import { SendMessage } from '../usecases/send-message/send-message.usecase';
import { SendMessageCommand } from '../usecases/send-message/send-message.command';
import { QueueNextJob } from '../usecases/queue-next-job/queue-next-job.usecase';
import { QueueNextJobCommand } from '../usecases/queue-next-job/queue-next-job.command';
import { JobEntity } from '@novu/dal';

@Injectable()
export class WorkflowQueueService {
  private bullConfig: QueueBaseOptions = {
    connection: {
      db: Number(process.env.REDIS_DB_INDEX),
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
    },
  };
  private queue: Queue;
  private worker: Worker;
  @Inject()
  private sendMessage: SendMessage;
  @Inject()
  private queueNextJob: QueueNextJob;

  constructor() {
    this.queue = new Queue('standard', this.bullConfig);
    this.worker = new Worker(
      'standard',
      async ({ data }: { data: JobEntity }) => {
        return await this.work(data);
      },
      {
        concurrency: 5000,
      }
    );
  }

  private async work(job: JobEntity) {
    await this.sendMessage.execute(
      SendMessageCommand.create({
        identifier: job.identifier,
        payload: job.payload,
        step: job.step,
        transactionId: job._transactionId,
        notificationID: job._notificationID,
        environmentId: job._environmentId,
        organizationId: job._organizationId,
        userId: job._userId,
        subscriberId: job._subscriberId,
      })
    );
    await this.queueNextJob.execute(
      QueueNextJobCommand.create({
        parentId: job._id,
        environmentId: job._environmentId,
        organizationId: job._organizationId,
        userId: job._userId,
      })
    );
  }

  public async addJob(data: JobEntity) {
    if (data.delay) {
      await this.queue.add(data._id, data, { delay: data.delay });

      return;
    }
    await this.queue.add(data._id, data);
  }
}
