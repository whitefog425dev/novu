import { BaseRepository } from '../base-repository';
import { JobEntity } from './job.entity';
import { Job } from './Job.schema';

export class JobRepository extends BaseRepository<JobEntity> {
  constructor() {
    super(Job, JobEntity);
  }

  public async storeJobs(jobs: JobEntity[]): Promise<JobEntity> {
    jobs = jobs
      .map((job: JobEntity) => {
        job._id = JobRepository.createObjectId();

        return job;
      })
      .map((job: JobEntity, index: number, list: JobEntity[]) => {
        if (index === 0) {
          return job;
        }
        job._parentId = list[index - 1]._id;

        return job;
      });

    const stored = [];

    for (const job of jobs) {
      const created = await this.create(job);
      stored.push(created);
    }

    return stored[0];
  }
}
